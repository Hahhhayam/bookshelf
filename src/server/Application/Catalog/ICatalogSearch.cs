namespace Application.Catalog;

public interface ICatalogSearch
{
    Task<IReadOnlyList<BookSearchResult>> SearchAsync(BookSearchQuery query, CancellationToken ct);
}
