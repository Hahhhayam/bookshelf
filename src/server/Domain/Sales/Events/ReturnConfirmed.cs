namespace Domain.Sales;

/// <summary>Leads to bonus reversal, stock return, an analytics update and export to accounting.</summary>
public sealed record ReturnConfirmed(
    ReturnId ReturnId, SaleId SaleId, LocationId LocationId, CustomerId? CustomerId,
    IReadOnlyList<ItemQuantity> Items, Money RefundTotal, ItemCondition Condition, UserId ConfirmedBy,
    DateTimeOffset OccurredAt) : IDomainEvent
{
    public Guid EventId { get; } = Guid.CreateVersion7();
}
