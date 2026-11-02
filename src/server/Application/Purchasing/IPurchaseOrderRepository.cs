namespace Application.Purchasing;

public interface IPurchaseOrderRepository
{
    Task<PurchaseOrder?> GetAsync(PurchaseOrderId id, CancellationToken ct);

    /// <summary>Orders that were sent and not yet fully received.</summary>
    Task<IReadOnlyList<PurchaseOrder>> ListAwaitingDeliveryAsync(CancellationToken ct);

    void Add(PurchaseOrder order);
}
