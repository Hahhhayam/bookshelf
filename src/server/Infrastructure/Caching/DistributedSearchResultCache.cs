using System.Security.Cryptography;
using System.Text;
using System.Text.Json;
using Application.Catalog;
using Microsoft.Extensions.Caching.Distributed;

namespace Infrastructure.Caching;

/// <summary>
/// Results are keyed by the filter combination and expire on a short TTL only: one price or stock change would have to
/// find every cached query containing the book, so entries are never invalidated and availability may lag by the TTL.
/// </summary>
internal sealed class DistributedSearchResultCache(IDistributedCache cache) : ISearchResultCache
{
    private static readonly DistributedCacheEntryOptions Expiry = new()
    {
        AbsoluteExpirationRelativeToNow = TimeSpan.FromSeconds(30),
    };

    public async Task<IReadOnlyList<BookSearchResult>?> GetAsync(BookSearchQuery query, CancellationToken ct)
    {
        var json = await cache.GetAsync(KeyFor(query), ct);
        return json is null
            ? null
            : JsonSerializer.Deserialize<CachedSearchHit[]>(json)!.Select(h => h.ToResult()).ToList();
    }

    public Task SetAsync(BookSearchQuery query, IReadOnlyList<BookSearchResult> results, CancellationToken ct) =>
        cache.SetAsync(
            KeyFor(query), JsonSerializer.SerializeToUtf8Bytes(results.Select(CachedSearchHit.From).ToArray()), Expiry, ct);

    private static string KeyFor(BookSearchQuery q)
    {
        var text = string.IsNullOrWhiteSpace(q.Text) ? "" : q.Text.Trim();
        var filters = $"{text}|{q.Isbn?.Value}|{q.Author?.Value}|{q.Publisher?.Value}|{q.Category?.Value}|{q.AvailableAt?.Value}";
        return $"catalog:search:{Convert.ToHexString(SHA256.HashData(Encoding.UTF8.GetBytes(filters)))}";
    }
}
