namespace Application.Administration;

public interface ISessionRevoker
{
    /// <summary>Does nothing when the session does not exist or is already revoked.</summary>
    Task RevokeAsync(Guid sessionId, CancellationToken ct);
}
