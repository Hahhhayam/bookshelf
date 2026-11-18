using Application.Catalog;

namespace Infrastructure.Persistence.Queries.Catalog;

internal sealed class CatalogSearch(BookstoreDbContext db) : ICatalogSearch
{
    public async Task<IReadOnlyList<BookSearchResult>> SearchAsync(BookSearchQuery query, CancellationToken ct)
    {
        var books = await Matching(query).ToListAsync(ct);
        var suggested = books.Count == 0 && WantsSuggestions(query);
        if (suggested)
            books = await ClosestAsync(query, ct);
        var availability = await AvailabilityAsync(books.Select(b => b.Id).ToList(), ct);

        return books
            .Select(book => ToResult(book, availability[book.Id], suggested))
            .Where(result => IsAvailableAt(result, query.AvailableAt))
            .ToList();
    }

    private static bool WantsSuggestions(BookSearchQuery query) =>
        query.SuggestClosest && query.Ids is null && !string.IsNullOrWhiteSpace(query.Text);

    private async Task<List<Book>> ClosestAsync(BookSearchQuery query, CancellationToken ct)
    {
        var candidates = await Matching(query with { Text = null }).ToListAsync(ct);
        var authors = await db.Set<Author>().AsNoTracking().ToDictionaryAsync(a => a.Id, a => a.Name, ct);
        return NearestMatch
            .Closest(query.Text!, candidates, book => book.Authors.Select(id => authors[id]).Append(book.Title))
            .ToList();
    }

    private IQueryable<Book> Matching(BookSearchQuery query)
    {
        var books = db.Set<Book>().AsNoTracking();
        if (query.Ids is { } ids)
            books = books.Where(b => ids.Contains(b.Id));
        else if (!query.IncludeInactive)
            books = books.Where(b => b.Status == Domain.Catalog.SaleStatus.Active);
        if (!string.IsNullOrWhiteSpace(query.Text))
        {
            var text = query.Text.Trim();
            var barcode = new Barcode(text);
            var matchingAuthors = db.Set<Author>().Where(a => a.Name.Contains(text)).Select(a => a.Id);
            books = books.Where(b => b.Title.Contains(text) || b.Barcode == barcode
                || EF.Property<List<AuthorId>>(b, "_authors").Any(id => matchingAuthors.Contains(id)));
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

    private static BookSearchResult ToResult(Book book, IEnumerable<LocationAvailability> availability, bool suggested) =>
        new(book.Id, book.Title, book.Price, availability.ToList(), book.Barcode, book.Status, suggested);

    private static bool IsAvailableAt(BookSearchResult result, LocationId? location) =>
        location is not { } at || result.Availability.Any(a => a.Location == at);
}
