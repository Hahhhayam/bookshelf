using Application.Administration;
using Domain.Administration;
using Infrastructure.Persistence;
using Infrastructure.Persistence.Sessions;

namespace Infrastructure.Security;

/// <summary>Reads the user's roles on every request, so blocking a user or changing a role takes effect at once.</summary>
internal sealed class SessionValidator(BookstoreDbContext db, IClock clock) : ISessionValidator
{
    public async Task<AuthenticatedSession?> ValidateAsync(string token, CancellationToken ct)
    {
        var hash = SessionToken.Hash(token);
        var session = await db.Set<UserSession>().AsNoTracking().FirstOrDefaultAsync(s => s.TokenHash == hash, ct);
        if (session is null || !session.IsActiveAt(clock.Now))
            return null;

        var user = await db.Set<User>().AsNoTracking().FirstOrDefaultAsync(u => u.Id == session.UserId, ct);
        return user is { Status: UserStatus.Active } ? await ToAuthenticatedAsync(session, user, ct) : null;
    }

    private async Task<AuthenticatedSession> ToAuthenticatedAsync(UserSession session, User user, CancellationToken ct)
    {
        var roleIds = user.Roles.ToList();
        var roles = await db.Set<Role>().AsNoTracking().Where(r => roleIds.Contains(r.Id)).ToListAsync(ct);
        var permissions = roles.SelectMany(r => r.Permissions).ToHashSet();
        return new AuthenticatedSession(session.Id, user.Id, permissions, user.Access.Locations);
    }
}
