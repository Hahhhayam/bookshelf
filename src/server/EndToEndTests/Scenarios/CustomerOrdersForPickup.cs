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
        await AddsToCart(customer, World.Kobzar, quantity: 2);
        var order = await PlacesPickupOrder(customer, World.StoreA);
        await TracksOrder(customer, order, status: "New", changes: 0);
        await OpensBookCard(customer, World.Kobzar, at: World.StoreA, available: 8);
    }

    private async Task FindsBookAvailableAt(Api customer, LocationId store, BookId book)
    {
        var hits = await customer.Get(Query.Of("books", ("text", World.Titles[book]), ("availableAt", store.Value)));
        var hit = hits.Items().With("id", book.Value);
        Assert.Contains(hit.Items("availability"), a => a["location"]!.GetValue<Guid>() == store.Value);
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
