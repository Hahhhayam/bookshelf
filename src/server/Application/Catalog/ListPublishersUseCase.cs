namespace Application.Catalog;

/// <summary>Also serves the public online shop, so no employee permission is required.</summary>
public sealed class ListPublishersUseCase(ICatalogLists lists)
{
    public Task<IReadOnlyList<Publisher>> ExecuteAsync(CancellationToken ct) => lists.PublishersAsync(ct);
}
