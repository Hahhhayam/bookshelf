namespace Application.Orders;

/// <summary>Called by the online-shop adapter. A customer who has added nothing yet gets an empty cart.</summary>
public sealed class GetCartUseCase(ICartRepository carts, IBookRepository books)
{
    public async Task<CartView> ExecuteAsync(CustomerId customer, CancellationToken ct)
    {
        var cart = await carts.FindByCustomerAsync(customer, ct);
        List<CartItem> items = cart is null ? [] : await DescribeLinesAsync(cart, ct);
        var total = items.Count == 0
            ? (Money?)null
            : Money.Sum(items.Select(i => i.UnitPrice * i.Quantity), items[0].UnitPrice.Currency);
        return new CartView(items, total);
    }

    private async Task<List<CartItem>> DescribeLinesAsync(Cart cart, CancellationToken ct)
    {
        var items = new List<CartItem>();
        foreach (var line in cart.Lines)
        {
            var book = await books.GetAsync(line.Id, ct).OrNotFound("Book");
            items.Add(new CartItem(line.Id, book.Title, line.Quantity, book.Price));
        }
        return items;
    }
}
