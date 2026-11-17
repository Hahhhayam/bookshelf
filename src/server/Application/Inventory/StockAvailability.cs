namespace Application.Inventory;

public static class StockAvailability
{
    /// <summary>Checks the combined requested quantity per book, because a book can appear on several lines.</summary>
    public static void EnsureAvailable(IReadOnlyDictionary<BookId, StockItem> stock, IEnumerable<ItemQuantity> requested)
    {
        var totals = requested.GroupBy(r => r.BookId)
            .Select(g => new ItemQuantity(g.Key, new Quantity(g.Sum(r => r.Quantity.Value))));

        foreach (var item in totals)
            Guard.That(item.Quantity <= stock[item.BookId].Level.Available,
                "stock-insufficient", $"Not enough available stock of book {item.BookId}.");
    }
}
