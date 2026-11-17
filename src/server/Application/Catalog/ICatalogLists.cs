namespace Application.Catalog;

/// <summary>The catalog's reference lists, by name, for pickers, filters and the names shown next to ids.</summary>
public interface ICatalogLists
{
    Task<IReadOnlyList<Author>> AuthorsAsync(CancellationToken ct);

    Task<IReadOnlyList<Publisher>> PublishersAsync(CancellationToken ct);

    Task<IReadOnlyList<Category>> CategoriesAsync(CancellationToken ct);
}
