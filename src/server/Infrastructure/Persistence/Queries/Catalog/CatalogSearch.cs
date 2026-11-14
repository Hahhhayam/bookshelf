using Application.Catalog;
using Domain.Catalog;
using Domain.Inventory;

namespace Infrastructure.Persistence.Queries.Catalog;

internal sealed class CatalogSearch(BookstoreDbContext db) : ICatalogSearch
{
    public async Task<IReadOnlyList<BookSearchResult>> SearchAsync(BookSearchQuery query, CancellationToken ct)
    {
        var books = await Matching(query).ToListAsync(ct);
        var availability = await AvailabilityAsync(books.Select(b => b.Id).ToList(), ct);

        return books
            .Select(book => ToResult(book, availability[book.Id]))
            .Where(result => IsAvailableAt(result, query.AvailableAt))
            .ToList();
    }

    private IQueryable<Book> Matching(BookSearchQuery query)
    {
        var books = db.Set<Book>().AsNoTracking().Where(b => b.Status == SaleStatus.Active);
        if (!string.IsNullOrWhiteSpace(query.Text))
        {
            var text = query.Text.Trim();
            var barcode = new Barcode(text);
            books = books.Where(b => b.Title.Contains(text) || b.Barcode == barcode);
        }
        if (query.Isbn is { } isbn)
            books = books.Where(b => b.Isbn == isbn);
        if (query.Author is { } author)
            books = books.Where(b => EF.Property<List<AuthorId>>(b, "_authors").Contains(author));
        if (query.Publisher is { } publisher)
            books = books.Where(b => b.PublisherId == publisher);
        if (query.Category is { } category)
            books = books.Where(b => b.CategoryId == category);
        return books;
    }

    private async Task<ILookup<BookId, LocationAvailability>> AvailabilityAsync(
        IReadOnlyList<BookId> books, CancellationToken ct)
    {
        var stock = await db.Set<StockItem>().AsNoTracking().Where(s => books.Contains(s.BookId)).ToListAsync(ct);
        return stock
            .Where(s => !s.Level.Available.IsZero)
            .ToLookup(s => s.BookId, s => new LocationAvailability(s.LocationId, s.Level.Available));
    }

    private static BookSearchResult ToResult(Book book, IEnumerable<LocationAvailability> availability) =>
        new(book.Id, book.Title, book.Price, availability.ToList());

    private static bool IsAvailableAt(BookSearchResult result, LocationId? location) =>
        location is not { } at || result.Availability.Any(a => a.Location == at);
}
