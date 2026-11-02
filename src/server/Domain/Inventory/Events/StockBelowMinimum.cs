namespace Domain.Inventory;

/// <summary>Leads to a low-stock notification.</summary>
public sealed record StockBelowMinimum(
    StockItemId StockItemId, LocationId LocationId, BookId BookId, Quantity OnHand, Quantity Minimum,
    DateTimeOffset OccurredAt) : IDomainEvent
{
    public Guid EventId { get; } = Guid.CreateVersion7();
}
