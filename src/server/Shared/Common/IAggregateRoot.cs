namespace Shared;

/// <summary>Non-generic view of an aggregate root, for infrastructure that collects events across all roots.</summary>
public interface IAggregateRoot
{
    IReadOnlyList<IDomainEvent> DomainEvents { get; }

    void ClearDomainEvents();
}
