namespace Application.Catalog;

public sealed class RefreshCatalogCache(ICatalogCache cache) : IEventHandler<PriceChanged>
{
    public Task HandleAsync(PriceChanged domainEvent, CancellationToken ct) =>
        cache.InvalidateAsync(domainEvent.BookId, ct);
}
