using Application.Catalog;

namespace Infrastructure.Persistence.Queries.Catalog;

internal sealed class BookDetailsQuery(BookstoreDbContext db) : IBookDetailsQuery
{
    public async Task<BookDetails?> FindAsync(BookId book, CancellationToken ct)
    {
        var found = await db.Set<Book>().AsNoTracking().FirstOrDefaultAsync(b => b.Id == book, ct);
        return found is null ? null : ToDetails(found);
    }

    public async Task<IReadOnlyList<LocationAvailability>> AvailabilityAsync(BookId book, CancellationToken ct)
    {
        var stock = await db.Set<StockItem>().AsNoTracking().Where(s => s.BookId == book).ToListAsync(ct);
        return stock
            .Where(s => !s.Level.Available.IsZero)
            .Select(s => new LocationAvailability(s.LocationId, s.Level.Available))
            .ToList();
    }

    public Task<ScheduledPrice?> ScheduledPriceAsync(BookId book, CancellationToken ct) =>
        db.Set<ScheduledPrice>().AsNoTracking().FirstOrDefaultAsync(p => p.Id == book, ct);

    public async Task<IReadOnlyList<PriceEntry>> PriceHistoryAsync(BookId book, CancellationToken ct) =>
        await db.Set<PriceEntry>().AsNoTracking().Where(e => e.BookId == book).OrderBy(e => e.ValidFrom).ToListAsync(ct);

    private static BookDetails ToDetails(Book book) => new(
        book.Id, book.Title, book.Price, book.Isbn, book.Barcode, book.ItemType, book.Status,
        book.PublisherId, book.CategoryId, book.Authors);
}
