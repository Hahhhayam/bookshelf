using Application.Administration;
using Infrastructure.Persistence;
using Infrastructure.Persistence.Sessions;

namespace Infrastructure.Security;

/// <summary>Saves the session by itself: the login use case has already committed the authentication result.</summary>
internal sealed class SessionIssuer(BookstoreDbContext db, IClock clock) : ISessionIssuer
{
    private static readonly TimeSpan Lifetime = TimeSpan.FromHours(8);

    public async Task<Session> IssueAsync(UserId user, CancellationToken ct)
    {
        var token = SessionToken.Generate();
        var issuedAt = clock.Now;
        var expiresAt = issuedAt + Lifetime;

        db.Set<UserSession>().Add(UserSession.Start(user, SessionToken.Hash(token), issuedAt, expiresAt));
        await db.SaveChangesAsync(ct);
        return new Session(token, expiresAt);
    }
}
