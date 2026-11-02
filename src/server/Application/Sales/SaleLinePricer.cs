namespace Application.Sales;

/// <summary>Prices sale lines at the current base price and applies a manual discount or the winning promotion.</summary>
public sealed class SaleLinePricer(IBookRepository books, IPromotionRepository promotions, ICurrentUser user)
{
    public async Task<IReadOnlyList<SaleLine>> PriceAsync(
        IEnumerable<SaleItemRequest> items, DateTimeOffset now, CancellationToken ct)
    {
        var activePromotions = await promotions.ListActiveAsync(now, ct);
        var lines = new List<SaleLine>();
        foreach (var item in items)
            lines.Add(await PriceLineAsync(item, activePromotions, now, ct));
        return lines;
    }

    private async Task<SaleLine> PriceLineAsync(
        SaleItemRequest item, IReadOnlyList<Promotion> activePromotions, DateTimeOffset now, CancellationToken ct)
    {
        var book = await books.GetAsync(item.Book, ct).OrNotFound("Book");
        Guard.That(book.IsActive, $"'{book.Title}' is not on sale.");

        var unitPrice = book.CurrentPrice(now);
        return new SaleLine(item.Book, item.Quantity, unitPrice, DiscountFor(item, book, unitPrice, activePromotions, now));
    }

    private Discount DiscountFor(
        SaleItemRequest item, Book book, Money unitPrice, IReadOnlyList<Promotion> activePromotions, DateTimeOffset now)
    {
        if (item.ManualDiscount is { } manual)
        {
            user.Require(Permissions.SalesDiscount);
            return new Discount(manual, DiscountSource.Manual);
        }

        var winner = Promotion.SelectWinner(activePromotions, item.Book, book.CategoryId, item.Quantity, now);
        return winner is null
            ? Discount.None(unitPrice.Currency)
            : new Discount(winner.DiscountFor(unitPrice * item.Quantity), DiscountSource.Promotion);
    }
}
