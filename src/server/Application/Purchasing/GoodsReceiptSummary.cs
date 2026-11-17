namespace Application.Purchasing;

/// <summary>A row of the receipt list; receipts with discrepancies stand out (scenario 3.9, step 3).</summary>
public sealed record GoodsReceiptSummary(
    GoodsReceiptId Receipt, SupplierId Supplier, LocationId Location, PurchaseOrderId? PurchaseOrder, int ReceivedUnits,
    bool HasDiscrepancies, DateTimeOffset? ConfirmedAt, UserId? ConfirmedBy);
