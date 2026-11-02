namespace Domain.Sales;

public sealed record SaleCancelled(
    SaleId SaleId, LocationId LocationId, IReadOnlyList<ItemQuantity> Items, UserId CancelledBy,
    DateTimeOffset OccurredAt) : IDomainEvent
{
    public Guid EventId { get; } = Guid.CreateVersion7();
}
