namespace Application.Purchasing;

/// <summary>A row of the purchase order list (scenario 3.11). Overdue orders get a warning.</summary>
public sealed record PurchaseOrderSummary(
    PurchaseOrderId Order, SupplierId Supplier, PurchaseOrderStatus Status, DateOnly ExpectedDate, bool IsOverdue,
    DateTimeOffset? LastChangedAt, UserId? LastChangedBy);
