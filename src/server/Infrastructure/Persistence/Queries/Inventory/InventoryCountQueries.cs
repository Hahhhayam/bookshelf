using Application.Inventory;

namespace Infrastructure.Persistence.Queries.Inventory;

internal sealed class InventoryCountQueries(BookstoreDbContext db) : IInventoryCountQueries
{
    public Task<InventoryCount?> FindAsync(InventoryCountId count, CancellationToken ct) =>
        db.Set<InventoryCount>().AsNoTracking().FirstOrDefaultAsync(c => c.Id == count, ct);

    public async Task<IReadOnlyList<InventoryCountSummary>> ListAsync(LocationId location, CancellationToken ct) =>
        await db.Set<InventoryCount>().AsNoTracking()
            .Where(c => c.LocationId == location)
            .OrderByDescending(c => c.StartedAt)
            .Select(c => new InventoryCountSummary(
                c.Id, c.LocationId, c.Status, c.StartedAt, c.Lines.Count, c.Lines.Count(l => l.Counted != null)))
            .ToListAsync(ct);
}
