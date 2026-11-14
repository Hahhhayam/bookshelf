namespace Application.Catalog;

public interface ISearchResultCache
{
    Task<IReadOnlyList<BookSearchResult>?> GetAsync(BookSearchQuery query, CancellationToken ct);

    Task SetAsync(BookSearchQuery query, IReadOnlyList<BookSearchResult> results, CancellationToken ct);
}
