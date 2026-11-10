namespace Infrastructure.Persistence.Sessions;

/// <summary>A login session. Only the hash of its token is stored, so a leaked table cannot be used to log in.</summary>
public sealed class UserSession
{
    public Guid Id { get; private set; }
    public UserId UserId { get; private set; }
    public string TokenHash { get; private set; } = "";
    public DateTimeOffset IssuedAt { get; private set; }
    public DateTimeOffset ExpiresAt { get; private set; }
    public DateTimeOffset? RevokedAt { get; private set; }

    public static UserSession Start(UserId user, string tokenHash, DateTimeOffset issuedAt, DateTimeOffset expiresAt) => new()
    {
        Id = Guid.CreateVersion7(),
        UserId = user,
        TokenHash = tokenHash,
        IssuedAt = issuedAt,
        ExpiresAt = expiresAt,
    };

    public bool IsActiveAt(DateTimeOffset moment) => RevokedAt is null && moment < ExpiresAt;

    public void Revoke(DateTimeOffset at) => RevokedAt ??= at;
}
