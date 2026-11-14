using Application.Administration;
using Infrastructure.Persistence;
using Infrastructure.Persistence.Sessions;

namespace Infrastructure.Security;

/// <summary>Saves by itself, like <see cref="SessionIssuer"/>: a session is not an aggregate and raises no events.</summary>
internal sealed class SessionRevoker(BookstoreDbContext db, IClock clock) : ISessionRevoker
{
    public async Task RevokeAsync(Guid sessionId, CancellationToken ct)
    {
        var session = await db.Set<UserSession>().FirstOrDefaultAsync(s => s.Id == sessionId, ct);
        if (session is null)
            return;

        session.Revoke(clock.Now);
        await db.SaveChangesAsync(ct);
    }
}
