namespace Application.Orders;

/// <param name="StockLocation">The store or warehouse whose stock is reserved for the order.</param>
public sealed record PlaceOrderCommand(
    CustomerId Customer, OrderType Type, FulfilmentMethod Fulfilment, LocationId StockLocation);

/// <summary>Scenario 3.8, first half: the cart becomes a New order and its quantities are reserved.</summary>
public sealed class PlaceOrderUseCase(
    ICartRepository carts, IOrderRepository orders, IBookRepository books, ILocationRepository locations,
    StockItemLoader stock, IPickupCodeGenerator codes, IClock clock, IUnitOfWork unitOfWork)
{
    public async Task<PlacedOrder> ExecuteAsync(PlaceOrderCommand command, CancellationToken ct)
    {
        await EnsurePickupAtOpenStoreAsync(command.Fulfilment, ct);
        var cart = await carts.FindByCustomerAsync(command.Customer, ct).OrNotFound("Cart");
        var now = clock.Now;

        var lines = await PriceLinesAsync(cart, ct);
        var order = Order.Place(command.Customer, command.Type, command.Fulfilment, command.StockLocation,
            codes.Next(), lines, now);
        await ReserveStockAsync(order, ct);

        cart.Clear();
        orders.Add(order);
        await unitOfWork.CommitAsync(ct);
        return new PlacedOrder(order.Id, order.PickupCode);
    }

    /// <summary>Customers collect only at stores (FR-07); the shop never offers a warehouse or a closed store.</summary>
    private async Task EnsurePickupAtOpenStoreAsync(FulfilmentMethod fulfilment, CancellationToken ct)
    {
        if (fulfilment.PickupLocation is not { } id) return;
        var location = await locations.GetAsync(id, ct).OrNotFound("Location");
        Guard.That(location.Type == LocationType.Store && location.IsActive, "pickup-location-not-store",
            "Orders can be collected only at an open store.");
    }

    private async Task<IReadOnlyList<(BookId, Quantity, Money)>> PriceLinesAsync(Cart cart, CancellationToken ct)
    {
        var lines = new List<(BookId, Quantity, Money)>();
        foreach (var line in cart.Lines)
        {
            var book = await books.GetAsync(line.Id, ct).OrNotFound("Book");
            Guard.That(book.IsActive, "book-inactive", $"'{book.Title}' is not on sale.");
            lines.Add((line.Id, line.Quantity, book.Price));
        }
        return lines;
    }

    private async Task ReserveStockAsync(Order order, CancellationToken ct)
    {
        foreach (var line in order.Lines)
        {
            var item = await stock.RequireAsync(order.StockLocation, line.Id, ct);
            item.Reserve(line.Quantity, ReservationPurpose.CustomerOrder, order.Id.Value);
        }
    }
}
