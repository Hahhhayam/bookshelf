namespace Infrastructure.Caching;

internal sealed record CachedStockLevel(Guid Location, int Available);
