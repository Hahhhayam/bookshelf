namespace Domain.Administration;

/// <summary>Logged for security; never contains the password.</summary>
public sealed record LoginFailed(UserId UserId, string Login, LoginResult Reason, DateTimeOffset OccurredAt) : IDomainEvent
{
    public Guid EventId { get; } = Guid.CreateVersion7();
}
