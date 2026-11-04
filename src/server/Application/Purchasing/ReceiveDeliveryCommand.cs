namespace Application.Purchasing;

/// <param name="PurchaseOrder">Null for an unplanned delivery, which then needs <paramref name="Supplier"/>.</param>
public sealed record ReceiveDeliveryCommand(
    LocationId Location, PurchaseOrderId? PurchaseOrder, SupplierId? Supplier, IReadOnlyList<ItemQuantity> Received);
