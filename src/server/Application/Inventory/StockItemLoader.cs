namespace Application.Inventory;

/// <summary>Loads stock records through the repository so the unit of work tracks them.</summary>
public sealed class StockItemLoader(IStockItemRepository stockItems)
{
    public Task<StockItem> RequireAsync(LocationId location, BookId book, CancellationToken ct) =>
        stockItems.FindAsync(location, book, ct).OrNotFound("Stock record");

    /// <summary>A book that was never stocked at the location gets its (single) stock record on first use.</summary>
    public async Task<StockItem> GetOrOpenAsync(LocationId location, BookId book, CancellationToken ct)
    {
        var existing = await stockItems.FindAsync(location, book, ct);
        if (existing is not null)
            return existing;

        var opened = StockItem.Open(location, book);
        stockItems.Add(opened);
        return opened;
    }

    public async Task<IReadOnlyDictionary<BookId, StockItem>> RequireManyAsync(
        LocationId location, IEnumerable<BookId> books, CancellationToken ct)
    {
        var result = new Dictionary<BookId, StockItem>();
        foreach (var book in books.Distinct())
            result[book] = await RequireAsync(location, book, ct);
        return result;
    }
}
