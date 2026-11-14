namespace Application.Purchasing;

public interface IPurchaseOrderQueries
{
    Task<PurchaseOrderView?> FindAsync(PurchaseOrderId order, DateOnly today, CancellationToken ct);

    /// <summary>Without a status, only orders not yet fully received or cancelled.</summary>
    Task<IReadOnlyList<PurchaseOrderSummary>> ListAsync(
        PurchaseOrderStatus? status, bool overdueOnly, DateOnly today, CancellationToken ct);
}
