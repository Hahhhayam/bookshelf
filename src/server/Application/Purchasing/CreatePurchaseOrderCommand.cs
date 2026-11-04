namespace Application.Purchasing;

public sealed record CreatePurchaseOrderCommand(
    SupplierId Supplier, DateOnly ExpectedDate, IReadOnlyList<PurchaseOrderLineRequest> Lines);
