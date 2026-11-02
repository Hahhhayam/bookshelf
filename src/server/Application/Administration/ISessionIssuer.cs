namespace Application.Administration;

/// <summary>Creates the session for a user whose role and allowed locations are resolved by the implementation.</summary>
public interface ISessionIssuer
{
    Task<Session> IssueAsync(UserId user, CancellationToken ct);
}
