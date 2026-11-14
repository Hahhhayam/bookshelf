using Application.Inventory;

namespace Infrastructure.Persistence.Queries.Inventory;

internal sealed class StockQueries(BookstoreDbContext db) : IStockQueries
{
    public async Task<IReadOnlyList<StockLine>> AtLocationAsync(
        LocationId location, BookId? book, bool belowMinimumOnly, CancellationToken ct)
    {
        var items = db.Set<StockItem>().AsNoTracking().Where(s => s.LocationId == location);
        if (book is { } wanted)
            items = items.Where(s => s.BookId == wanted);

        // Reserved sums the active reservations and Quantity's operators are not translatable, so both run in memory.
        return (await items.ToListAsync(ct))
            .Select(s => new StockLine(
                s.BookId, s.OnHand, s.Reserved, s.Level.Available, s.MinimumStock, s.OnHand < s.MinimumStock))
            .Where(line => !belowMinimumOnly || line.BelowMinimum)
            .ToList();
    }
}
