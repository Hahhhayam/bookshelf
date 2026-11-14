namespace Application.Purchasing;

public sealed record PurchaseOrderView(
    PurchaseOrder Order, IReadOnlyList<PurchaseOrderStatusChange> History, bool IsOverdue);
