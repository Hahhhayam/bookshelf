using System.Text.Json;

namespace Infrastructure.Persistence.Outbox;

/// <summary>A domain event stored in the same transaction as the aggregate change; a relay publishes it later.</summary>
public sealed class OutboxMessage
{
    public Guid Id { get; private set; }
    public string EventType { get; private set; } = "";
    public string Payload { get; private set; } = "";
    public DateTimeOffset OccurredAt { get; private set; }
    public DateTimeOffset? ProcessedAt { get; private set; }

    public static OutboxMessage From(IDomainEvent domainEvent, JsonSerializerOptions options) => new()
    {
        Id = domainEvent.EventId,
        EventType = domainEvent.GetType().AssemblyQualifiedName!,
        Payload = JsonSerializer.Serialize(domainEvent, domainEvent.GetType(), options),
        OccurredAt = domainEvent.OccurredAt,
    };

    public void MarkProcessed(DateTimeOffset at) => ProcessedAt = at;
}
