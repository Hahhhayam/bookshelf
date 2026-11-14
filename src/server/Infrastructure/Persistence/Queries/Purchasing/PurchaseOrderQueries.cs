using Application.Purchasing;

namespace Infrastructure.Persistence.Queries.Purchasing;

internal sealed class PurchaseOrderQueries(BookstoreDbContext db) : IPurchaseOrderQueries
{
    public async Task<PurchaseOrderView?> FindAsync(PurchaseOrderId order, DateOnly today, CancellationToken ct)
    {
        var found = await db.Set<PurchaseOrder>().AsNoTracking().FirstOrDefaultAsync(o => o.Id == order, ct);
        if (found is null)
            return null;
        var history = await db.Set<PurchaseOrderStatusChange>().AsNoTracking()
            .Where(c => c.ParentId == order).OrderBy(c => c.At).ToListAsync(ct);
        return new PurchaseOrderView(found, history, found.IsOverdue(today));
    }

    public async Task<IReadOnlyList<PurchaseOrderSummary>> ListAsync(
        PurchaseOrderStatus? status, bool overdueOnly, DateOnly today, CancellationToken ct)
    {
        var orders = db.Set<PurchaseOrder>().AsNoTracking();
        orders = status is { } wanted
            ? orders.Where(o => o.Status == wanted)
            : orders.Where(o => o.Status != PurchaseOrderStatus.Received && o.Status != PurchaseOrderStatus.Cancelled);
        var rows = (await orders.Select(o => new { o.Id, o.SupplierId, o.Status, o.ExpectedDate }).ToListAsync(ct))
            .Where(o => !overdueOnly || PurchaseOrder.IsLate(o.Status, o.ExpectedDate, today))
            .ToList();

        var latest = await LatestChanges.ForAsync<PurchaseOrderStatusChange, PurchaseOrderId, PurchaseOrderStatus>(
            db.Set<PurchaseOrderStatusChange>(), rows.Select(o => o.Id).ToList(), ct);
        return rows.Select(o => new PurchaseOrderSummary(o.Id, o.SupplierId, o.Status, o.ExpectedDate,
            PurchaseOrder.IsLate(o.Status, o.ExpectedDate, today),
            latest.GetValueOrDefault(o.Id)?.At, latest.GetValueOrDefault(o.Id)?.By)).ToList();
    }
}
