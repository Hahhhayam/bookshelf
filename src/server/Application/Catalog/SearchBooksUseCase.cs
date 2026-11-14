namespace Application.Catalog;

/// <param name="AvailableAt">When set, only books with available stock at this location are returned.</param>
public sealed record BookSearchQuery(
    string? Text, Isbn? Isbn, AuthorId? Author, PublisherId? Publisher, CategoryId? Category, LocationId? AvailableAt);

/// <summary>FR-03. Also serves the public online shop, so no employee permission is required.</summary>
public sealed class SearchBooksUseCase(ICatalogSearch search, ISearchResultCache cache)
{
    public async Task<IReadOnlyList<BookSearchResult>> ExecuteAsync(BookSearchQuery query, CancellationToken ct) =>
        await cache.GetAsync(query, ct) ?? await SearchAndCacheAsync(query, ct);

    private async Task<IReadOnlyList<BookSearchResult>> SearchAndCacheAsync(BookSearchQuery query, CancellationToken ct)
    {
        var results = await search.SearchAsync(query, ct);
        await cache.SetAsync(query, results, ct);
        return results;
    }
}
