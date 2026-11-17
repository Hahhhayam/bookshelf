namespace Application.Catalog;

/// <summary>Also serves the public online shop, so no employee permission is required.</summary>
public sealed class ListAuthorsUseCase(ICatalogLists lists)
{
    public Task<IReadOnlyList<Author>> ExecuteAsync(CancellationToken ct) => lists.AuthorsAsync(ct);
}
