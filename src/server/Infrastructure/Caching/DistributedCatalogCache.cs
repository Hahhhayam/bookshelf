using System.Text.Json;
using Application.Catalog;
using Microsoft.Extensions.Caching.Distributed;

namespace Infrastructure.Caching;

internal sealed class DistributedCatalogCache(IDistributedCache cache) : ICatalogCache
{
    /// <summary>Safety net for changes that raise no event, such as editing details or deactivating a book.</summary>
    private static readonly DistributedCacheEntryOptions Expiry = new()
    {
        AbsoluteExpirationRelativeToNow = TimeSpan.FromMinutes(15),
    };

    private static string KeyFor(BookId book) => $"catalog:book:{book}";

    public async Task<BookDetails?> GetAsync(BookId book, CancellationToken ct)
    {
        var json = await cache.GetAsync(KeyFor(book), ct);
        return json is null ? null : JsonSerializer.Deserialize<CachedBook>(json)?.ToDetails();
    }

    public Task SetAsync(BookDetails details, CancellationToken ct) =>
        cache.SetAsync(KeyFor(details.Book), JsonSerializer.SerializeToUtf8Bytes(CachedBook.From(details)), Expiry, ct);

    public Task InvalidateAsync(BookId book, CancellationToken ct) => cache.RemoveAsync(KeyFor(book), ct);
}
