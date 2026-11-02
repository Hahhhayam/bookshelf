namespace Domain.Administration;

/// <summary>Leads to a critical error notification for administrators.</summary>
public sealed record IntegrationFailed(
    IntegrationId IntegrationId, IntegrationKind Kind, string Error, DateTimeOffset OccurredAt) : IDomainEvent
{
    public Guid EventId { get; } = Guid.CreateVersion7();
}
