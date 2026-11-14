using System.Runtime.CompilerServices;

namespace Shared;

/// <summary>A fact that already happened; handled in the same transaction that saves the aggregate.</summary>
public interface IDomainEvent
{
    Guid EventId { get; }
    DateTimeOffset OccurredAt { get; }
}
