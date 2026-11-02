namespace Domain.Purchasing;

/// <summary>Increases stock and updates the purchase order status.</summary>
public sealed record GoodsReceived(
    GoodsReceiptId GoodsReceiptId, PurchaseOrderId? PurchaseOrderId, SupplierId SupplierId, LocationId LocationId,
    IReadOnlyList<ItemQuantity> Items, bool HasDiscrepancy, UserId ConfirmedBy, DateTimeOffset OccurredAt) : IDomainEvent
{
    public Guid EventId { get; } = Guid.CreateVersion7();
}
