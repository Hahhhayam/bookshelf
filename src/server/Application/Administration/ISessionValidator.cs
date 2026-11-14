namespace Application.Administration;

public interface ISessionValidator
{
    /// <returns>Null when the token is unknown, expired or revoked, or when its user is blocked.</returns>
    Task<AuthenticatedSession?> ValidateAsync(string token, CancellationToken ct);
}
