using Application.Purchasing;

namespace Infrastructure.Persistence.Queries.Purchasing;

internal sealed class GoodsReceiptQueries(BookstoreDbContext db) : IGoodsReceiptQueries
{
    public Task<GoodsReceipt?> FindAsync(GoodsReceiptId receipt, CancellationToken ct) =>
        db.Set<GoodsReceipt>().AsNoTracking().AsSplitQuery().FirstOrDefaultAsync(r => r.Id == receipt, ct);

    public async Task<IReadOnlyList<GoodsReceiptSummary>> ListAsync(LocationId location, CancellationToken ct)
    {
        var rows = await db.Set<GoodsReceipt>().AsNoTracking().AsSplitQuery()
            .Where(r => r.LocationId == location)
            .OrderByDescending(r => r.ConfirmedAt)
            .ToListAsync(ct);

        // Quantity's operators are not translatable, so the units are summed in memory.
        return rows.Select(r => new GoodsReceiptSummary(
            r.Id, r.SupplierId, r.LocationId, r.PurchaseOrderId, r.Lines.Sum(l => l.Received.Value),
            r.Discrepancies.Count > 0, r.ConfirmedAt, r.ConfirmedBy)).ToList();
    }
}
