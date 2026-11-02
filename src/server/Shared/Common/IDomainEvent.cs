using System.Runtime.CompilerServices;

namespace Shared;

/// <summary>A fact that already happened; published through the transactional outbox.</summary>
public interface IDomainEvent
{
    Guid EventId { get; }
    DateTimeOffset OccurredAt { get; }
}
