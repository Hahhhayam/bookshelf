namespace Application.Administration;

/// <summary>Ends the caller's own session. The id comes from the authenticated principal, never from the request body.</summary>
public sealed class LogoutUseCase(ISessionRevoker sessions)
{
    public Task ExecuteAsync(Guid sessionId, CancellationToken ct) => sessions.RevokeAsync(sessionId, ct);
}
