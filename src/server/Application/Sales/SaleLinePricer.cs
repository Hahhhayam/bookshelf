namespace Application.Sales;

/// <summary>
/// Prices sale lines at the current base price and applies a manual discount or the winning promotion, including the
/// personal offers of the customer whose card is on the sale.
/// </summary>
public sealed class SaleLinePricer(
    IBookRepository books, IPromotionRepository promotions, ICustomerRepository customers, ICurrentUser user)
{
    public async Task<IReadOnlyList<SaleLine>> PriceAsync(
        IEnumerable<SaleItemRequest> items, CustomerId? customer, DateTimeOffset now, CancellationToken ct)
    {
        var activePromotions = await promotions.ListActiveAsync(now, ct);
        var buyer = customer is { } id ? await customers.GetAsync(id, ct).OrNotFound("Customer") : null;
        var lines = new List<SaleLine>();
        foreach (var item in items)
            lines.Add(await PriceLineAsync(item, activePromotions, buyer, now, ct));
        return lines;
    }

    private async Task<SaleLine> PriceLineAsync(SaleItemRequest item, IReadOnlyList<Promotion> activePromotions,
        Customer? buyer, DateTimeOffset now, CancellationToken ct)
    {
        var book = await books.GetAsync(item.Book, ct).OrNotFound("Book");
        Guard.That(book.IsActive, "book-inactive", $"'{book.Title}' is not on sale.");

        var discount = DiscountFor(item, book, book.Price, activePromotions, buyer, now);
        return new SaleLine(item.Book, item.Quantity, book.Price, discount);
    }

    private Discount DiscountFor(SaleItemRequest item, Book book, Money unitPrice,
        IReadOnlyList<Promotion> activePromotions, Customer? buyer, DateTimeOffset now)
    {
        if (item.ManualDiscount is { } manual)
        {
            user.Require(Permissions.SalesDiscount);
            return new Discount(manual, DiscountSource.Manual);
        }

        var winner = Promotion.SelectWinner(activePromotions, item.Book, book.CategoryId, item.Quantity, buyer, now);
        return winner is null
            ? Discount.None(unitPrice.Currency)
            : new Discount(winner.DiscountFor(unitPrice * item.Quantity), DiscountSource.Promotion);
    }
}
