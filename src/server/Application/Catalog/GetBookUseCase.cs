namespace Application.Catalog;

/// <summary>Also serves the public online shop, so no employee permission is required.</summary>
public sealed class GetBookUseCase(IBookDetailsQuery query, ICatalogCache cache)
{
    public async Task<BookView> ExecuteAsync(BookId book, CancellationToken ct)
    {
        var details = await cache.GetAsync(book, ct) ?? await LoadAndCacheAsync(book, ct);
        var availability = await query.AvailabilityAsync(book, ct);
        return new BookView(details, availability);
    }

    private async Task<BookDetails> LoadAndCacheAsync(BookId book, CancellationToken ct)
    {
        var details = await query.FindAsync(book, ct).OrNotFound("Book");
        await cache.SetAsync(details, ct);
        return details;
    }
}
