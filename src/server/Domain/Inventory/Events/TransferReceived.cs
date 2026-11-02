namespace Domain.Inventory;

/// <summary>Updates stock at the receiving location; a mismatch raises a discrepancy for review.</summary>
public sealed record TransferReceived(
    TransferId TransferId, Route Route, IReadOnlyList<ItemQuantity> ReceivedItems, bool HasDiscrepancy,
    DateTimeOffset OccurredAt) : IDomainEvent
{
    public Guid EventId { get; } = Guid.CreateVersion7();
}
