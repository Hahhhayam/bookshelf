namespace EndToEndTests.Scenarios;

/// <summary>Scenario 1: the customer finds a book and orders it for pickup (FR-03, FR-07, scenario 3.8).</summary>
[Collection(EndToEndCollection.Name)]
public sealed class CustomerOrdersForPickup(SqlServerFixture sql) : EndToEndTest(sql)
{
    [Fact]
    public async Task Customer_finds_a_book_and_orders_it_for_pickup()
    {
        await Preseed(Sample.Standard);
        var customer = Anonymous();

        await FindsBookAvailableAt(customer, World.StoreA, World.Kobzar);
        await OpensBookCard(customer, World.Kobzar, at: World.StoreA, available: 10);
        await ChecksPriceHistory(customer, World.Kobzar, 300m);
        await SeesPickupStores(customer, World.StoreA, World.StoreB);
        await AddsToCart(customer, World.Kobzar, quantity: 1);
        await AddsToCart(customer, World.Dune, quantity: 1);
        await ChangesCartQuantity(customer, World.Kobzar, quantity: 2);
        await RemovesFromCart(customer, World.Dune);
        await SeesCart(customer, World.Kobzar, quantity: 2, total: 600m);
        await CannotPickUpAtWarehouse(customer);
        var order = await PlacesPickupOrder(customer, World.StoreA);
        await SeesCartIsEmpty(customer);
        await ReadsPlacedOrder(customer, order, World.StoreA, World.Kobzar, quantity: 2, total: 600m);
        await TracksOrder(customer, order, status: "New", changes: 0);
        await OpensBookCard(customer, World.Kobzar, at: World.StoreA, available: 8);
    }

    private async Task FindsBookAvailableAt(Api customer, LocationId store, BookId book)
    {
        var hits = await customer.Get(Query.Of("books", ("text", World.Titles[book]), ("availableAt", store.Value)));
        var hit = hits.Items().With("id", book.Value);
        Assert.Contains(hit.Items("availability"), a => a["location"]!.GetValue<Guid>() == store.Value);
    }

    private async Task SeesPickupStores(Api customer, params LocationId[] stores)
    {
        var listed = await customer.Get("stores");
        Assert.Equal(stores.Select(s => s.Value), listed.Items().Select(s => s.Id()));
        Assert.DoesNotContain(listed.Items(), s => s.Id() == World.Warehouse.Value);
    }

    /// <summary>The shop lists only stores, but the API must refuse a warehouse sent directly too.</summary>
    private Task CannotPickUpAtWarehouse(Api customer) =>
        customer.Rejected("pickup-location-not-store", HttpMethod.Post, "orders", new
        {
            customer = World.Customer.Value, type = "Retail", stockLocation = World.Warehouse.Value,
            fulfilment = new { kind = "Pickup", pickupLocation = World.Warehouse.Value, deliveryAddress = (string?)null },
        });

    private Task ChangesCartQuantity(Api customer, BookId book, int quantity) =>
        customer.Put($"customers/{World.Customer.Value}/cart/items/{book.Value}", new { quantity });

    private Task RemovesFromCart(Api customer, BookId book) =>
        customer.Delete($"customers/{World.Customer.Value}/cart/items/{book.Value}");

    private async Task SeesCart(Api customer, BookId book, int quantity, decimal total)
    {
        var cart = await customer.Get($"customers/{World.Customer.Value}/cart");
        var line = Assert.Single(cart.Items("lines"));
        Assert.Equal(book.Value, line["book"]!.GetValue<Guid>());
        Assert.Equal(World.Titles[book], line.Text("title"));
        Assert.Equal(quantity, line.Number("quantity"));
        Assert.Equal(total, cart.Amount("total"));
    }

    private async Task SeesCartIsEmpty(Api customer)
    {
        var cart = await customer.Get($"customers/{World.Customer.Value}/cart");
        Assert.Empty(cart.Items("lines"));
    }

    /// <summary>The confirmation page reads the placed order back by its pickup code.</summary>
    private static async Task ReadsPlacedOrder(
        Api customer, PlacedOrderRef order, LocationId store, BookId book, int quantity, decimal total)
    {
        var placed = await customer.Get($"orders/track/{order.PickupCode}");
        Assert.Equal(store.Value, placed["store"]!.GetValue<Guid>());
        Assert.Equal(total, placed.Amount("total"));
        var line = Assert.Single(placed.Items("lines"));
        Assert.Equal(book.Value, line["book"]!.GetValue<Guid>());
        Assert.Equal(quantity, line.Number("quantity"));
    }

    private static async Task OpensBookCard(Api customer, BookId book, LocationId at, int available)
    {
        var card = await customer.Get($"books/{book.Value}");
        var atStore = card.Items("availability").SingleOrDefault(a => a["location"]!.GetValue<Guid>() == at.Value);
        Assert.Equal(available, atStore?.Number("available") ?? 0);
    }

    private static async Task ChecksPriceHistory(Api customer, BookId book, params decimal[] prices)
    {
        var history = await customer.Get($"books/{book.Value}/prices");
        Assert.Equal(prices, history.Items().Select(e => e.Amount("price")));
    }
}
