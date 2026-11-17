namespace Application.Catalog;

/// <summary>Also serves the public online shop, so no employee permission is required.</summary>
public sealed class ListCategoriesUseCase(ICatalogLists lists)
{
    public Task<IReadOnlyList<Category>> ExecuteAsync(CancellationToken ct) => lists.CategoriesAsync(ct);
}
