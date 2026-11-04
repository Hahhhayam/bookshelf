using Application.Inventory;
using Domain.Inventory;

namespace Infrastructure.Persistence.Repositories.Inventory;

internal sealed class StockItemRepository(BookstoreDbContext db) : IStockItemRepository
{
    public Task<StockItem?> FindAsync(LocationId location, BookId book, CancellationToken ct) =>
        db.Set<StockItem>().FirstOrDefaultAsync(s => s.LocationId == location && s.BookId == book, ct);

    public async Task<IReadOnlyList<StockItem>> ListByLocationAsync(LocationId location, CancellationToken ct) =>
        await db.Set<StockItem>().Where(s => s.LocationId == location).ToListAsync(ct);

    public async Task<IReadOnlyList<StockItem>> ListWithExpiredReservationsAsync(DateTimeOffset now, CancellationToken ct) =>
        await db.Set<StockItem>()
            .Where(s => s.Reservations.Any(r =>
                r.Status == ReservationStatus.Active && r.ExpiresAt != null && r.ExpiresAt <= now))
            .ToListAsync(ct);

    public void Add(StockItem item) => db.Set<StockItem>().Add(item);
}
