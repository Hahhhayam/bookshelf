using Application.Purchasing;

namespace Infrastructure.Persistence.Repositories.Purchasing;

internal sealed class PurchaseOrderRepository(BookstoreDbContext db) : IPurchaseOrderRepository
{
    private static readonly PurchaseOrderStatus[] AwaitingDelivery = [PurchaseOrderStatus.Sent, PurchaseOrderStatus.PartlyReceived];

    public Task<PurchaseOrder?> GetAsync(PurchaseOrderId id, CancellationToken ct) =>
        db.Set<PurchaseOrder>().FirstOrDefaultAsync(o => o.Id == id, ct);

    public async Task<IReadOnlyList<PurchaseOrder>> ListAwaitingDeliveryAsync(CancellationToken ct) =>
        await db.Set<PurchaseOrder>().Where(o => AwaitingDelivery.Contains(o.Status)).ToListAsync(ct);

    public void Add(PurchaseOrder order) => db.Set<PurchaseOrder>().Add(order);
}
