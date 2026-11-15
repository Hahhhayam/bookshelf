namespace EndToEndTests.Scenarios;

/// <summary>Scenario 3: a sale with the customer card, a promotion and bonuses (FR-04, FR-09, FR-14, FR-15, scenario 3.5).</summary>
[Collection(EndToEndCollection.Name)]
public sealed class CashierSellsWithCard(SqlServerFixture sql) : EndToEndTest(sql)
{
    [Fact]
    public async Task Cashier_sells_once_even_when_the_till_resends()
    {
        await Preseed(Sample.Standard);

        var cashier = await LogsIn(SampleUsers.Cashier);
        await FindsCustomerByCard(cashier, bonusBalance: 0, purchases: 0);
        await FindsBookByIsbn(cashier, World.Dune, "9780441013593");
        var sale = await Sells(cashier, "till-1/0001", total: 705m, (World.Kobzar, 1), (World.Dune, 1));
        await ResendsSaleAndGetsSameReceipt(cashier, "till-1/0001", sale, total: 705m, (World.Kobzar, 1), (World.Dune, 1));
        await SeesStock(cashier, World.StoreA, World.Dune, onHand: 4, reserved: 0);
        await FindsCustomerByCard(cashier, bonusBalance: 7, purchases: 1);
        await CannotSellMoreThanAvailable(cashier, World.Notebook, quantity: 21, unitPrice: 50m);
    }

    private static async Task FindsBookByIsbn(Api cashier, BookId book, string isbn)
    {
        var hits = await cashier.Get(Query.Of("books", ("isbn", isbn)));
        Assert.Equal(book.Value, hits.Items().Single().Id());
    }

    private async Task ResendsSaleAndGetsSameReceipt(
        Api cashier, string idempotencyKey, Guid sale, decimal total, params (BookId Book, int Quantity)[] items) =>
        Assert.Equal(sale, await Sells(cashier, idempotencyKey, total, items));

    private Task CannotSellMoreThanAvailable(Api cashier, BookId book, int quantity, decimal unitPrice) =>
        cashier.Refused(HttpStatusCode.UnprocessableEntity, HttpMethod.Post, "sales",
            SaleBody(null, unitPrice * quantity, (book, quantity)), IdempotencyKey($"refused-{Guid.NewGuid():N}"));
}
