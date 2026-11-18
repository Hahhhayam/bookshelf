namespace Application.Catalog;

/// <param name="AvailableAt">When set, only books with available stock at this location are returned.</param>
/// <param name="Ids">A batch lookup for lists that carry only book ids. Like the book card, it finds deactivated books too.</param>
/// <param name="IncludeInactive">Deactivated books as well, for catalog staff; the shop sees books on sale only.</param>
/// <param name="SuggestClosest">When the text matches nothing, return the nearest titles/authors (marked as suggestions).</param>
public sealed record BookSearchQuery(
    string? Text, Isbn? Isbn, AuthorId? Author, PublisherId? Publisher, CategoryId? Category, LocationId? AvailableAt,
    IReadOnlyList<BookId>? Ids = null, bool IncludeInactive = false, bool SuggestClosest = false);

/// <summary>FR-03. Also serves the public online shop, so no employee permission is required.</summary>
public sealed class SearchBooksUseCase(ICatalogSearch search, ISearchResultCache cache, ICurrentUser user)
{
    public const int MaxIds = 200;

    public async Task<IReadOnlyList<BookSearchResult>> ExecuteAsync(BookSearchQuery query, CancellationToken ct)
    {
        if (query.IncludeInactive)
            user.RequireAny(Permissions.CatalogEdit, Permissions.PriceChange);
        Guard.That(query.Ids is null || query.Ids.Count <= MaxIds, "too-many-ids", $"At most {MaxIds} books can be looked up at once.");
        return await cache.GetAsync(query, ct) ?? await SearchAndCacheAsync(query, ct);
    }

    private async Task<IReadOnlyList<BookSearchResult>> SearchAndCacheAsync(BookSearchQuery query, CancellationToken ct)
    {
        var results = await search.SearchAsync(query, ct);
        await cache.SetAsync(query, results, ct);
        return results;
    }
}
