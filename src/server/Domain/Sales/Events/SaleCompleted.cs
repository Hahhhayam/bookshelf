namespace Domain.Sales;

/// <summary>Leads to bonus accrual, an analytics update and export to accounting.</summary>
public sealed record SaleCompleted(
    SaleId SaleId, LocationId LocationId, CustomerId? CustomerId, IReadOnlyList<ItemQuantity> Items, Money Total,
    DateTimeOffset OccurredAt) : IDomainEvent
{
    public Guid EventId { get; } = Guid.CreateVersion7();
}
