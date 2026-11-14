using Application.Inventory;

namespace Infrastructure.Persistence.Repositories.Inventory;

internal sealed class InventoryCountRepository(BookstoreDbContext db) : IInventoryCountRepository
{
    public Task<InventoryCount?> GetAsync(InventoryCountId id, CancellationToken ct) =>
        db.Set<InventoryCount>().FirstOrDefaultAsync(c => c.Id == id, ct);

    public void Add(InventoryCount count) => db.Set<InventoryCount>().Add(count);
}
