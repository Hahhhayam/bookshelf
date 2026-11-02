namespace Domain.Inventory;

/// <summary>Updates stock at the sending location.</summary>
public sealed record TransferShipped(
    TransferId TransferId, Route Route, IReadOnlyList<ItemQuantity> Items, DateTimeOffset OccurredAt) : IDomainEvent
{
    public Guid EventId { get; } = Guid.CreateVersion7();
}
