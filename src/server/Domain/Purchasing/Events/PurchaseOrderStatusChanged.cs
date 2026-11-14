namespace Domain.Purchasing;

/// <summary>Leads to a purchase order status history entry.</summary>
public sealed record PurchaseOrderStatusChanged(
    PurchaseOrderId PurchaseOrderId, PurchaseOrderStatus From, PurchaseOrderStatus To, UserId ChangedBy,
    DateTimeOffset OccurredAt) : IDomainEvent
{
    public Guid EventId { get; } = Guid.CreateVersion7();
}
