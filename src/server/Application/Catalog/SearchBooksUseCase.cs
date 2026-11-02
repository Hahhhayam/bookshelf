namespace Application.Catalog;

/// <param name="AvailableAt">When set, only books with available stock at this location are returned.</param>
public sealed record BookSearchQuery(
    string? Text, Isbn? Isbn, AuthorId? Author, PublisherId? Publisher, CategoryId? Category, LocationId? AvailableAt);

/// <summary>FR-03. Also serves the public online shop, so no employee permission is required.</summary>
public sealed class SearchBooksUseCase(ICatalogSearch search)
{
    public Task<IReadOnlyList<BookSearchResult>> ExecuteAsync(BookSearchQuery query, CancellationToken ct) =>
        search.SearchAsync(query, ct);
}
