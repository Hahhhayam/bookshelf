namespace Infrastructure.Persistence.Configurations.Purchasing;

internal sealed class PurchaseOrderStatusChangeConfiguration()
    : ChangeConfiguration<PurchaseOrderStatusChange, PurchaseOrderId, PurchaseOrderStatus>(
        "purchasing", "PurchaseOrderStatusChanges", nameof(PurchaseOrderId));
