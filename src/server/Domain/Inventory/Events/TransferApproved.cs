namespace Domain.Inventory;

/// <summary>Inventory reserves the goods at the sending location.</summary>
public sealed record TransferApproved(
    TransferId TransferId, Route Route, IReadOnlyList<ItemQuantity> Items, DateTimeOffset OccurredAt) : IDomainEvent
{
    public Guid EventId { get; } = Guid.CreateVersion7();
}
