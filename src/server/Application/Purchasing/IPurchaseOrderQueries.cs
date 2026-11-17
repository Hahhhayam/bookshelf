namespace Application.Purchasing;

public interface IPurchaseOrderQueries
{
    Task<PurchaseOrderView?> FindAsync(PurchaseOrderId order, DateOnly today, CancellationToken ct);

    /// <summary>
    /// Without a status, orders of every status, or with <paramref name="openOnly"/> only those not yet fully received
    /// or cancelled.
    /// </summary>
    Task<IReadOnlyList<PurchaseOrderSummary>> ListAsync(
        PurchaseOrderStatus? status, bool openOnly, bool overdueOnly, DateOnly today, CancellationToken ct);
}
