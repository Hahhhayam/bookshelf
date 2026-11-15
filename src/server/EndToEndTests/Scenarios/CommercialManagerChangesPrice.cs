namespace EndToEndTests.Scenarios;

/// <summary>Scenario 5: a price change (FR-02, FR-17, scenario 3.3, catalog cache).</summary>
[Collection(EndToEndCollection.Name)]
public sealed class CommercialManagerChangesPrice(SqlServerFixture sql) : EndToEndTest(sql)
{
    [Fact]
    public async Task New_price_is_shown_at_once_and_kept_in_history_and_audit()
    {
        await Preseed(Sample.Standard);

        var commercial = await LogsIn(SampleUsers.Commercial);
        await OpensBookCard(commercial, World.Kobzar, price: 300m);
        await ChangesPrice(commercial, World.Kobzar, newPrice: 350m);
        await OpensBookCard(commercial, World.Kobzar, price: 350m);
        await ChecksPriceHistory(commercial, World.Kobzar, 300m, 350m);
        await SeesPriceChangeInAudit(commercial, World.Kobzar, before: 300m, after: 350m, by: UserOf(SampleUsers.Commercial));
        await CannotSetNegativePrice(commercial, World.Kobzar);

        var cashier = await LogsIn(SampleUsers.Cashier);
        await CannotChangePrice(cashier, World.Kobzar);
    }

    private static async Task OpensBookCard(Api employee, BookId book, decimal price) =>
        Assert.Equal(price, (await employee.Get($"books/{book.Value}")).Amount("price"));

    private static Task ChangesPrice(Api commercial, BookId book, decimal newPrice) =>
        commercial.Post($"books/{book.Value}/price", new { newPrice = Uah(newPrice) });

    private static async Task ChecksPriceHistory(Api employee, BookId book, params decimal[] prices)
    {
        var history = await employee.Get($"books/{book.Value}/prices");
        Assert.Equal(prices, history.Items().Select(e => e.Amount("price")));
    }

    /// <summary>The audit keeps prices as the server formats money, so the expectation is formatted the same way.</summary>
    private static async Task SeesPriceChangeInAudit(Api commercial, BookId book, decimal before, decimal after, UserId by)
    {
        var records = await commercial.Get(Query.Of("audit", ("subject", book.Value), ("action", "book.price-changed")));
        var record = records.Items().Single();
        Assert.Equal(new Money(before, CurrencyCode.Uah).ToString(), record.Text("before"));
        Assert.Equal(new Money(after, CurrencyCode.Uah).ToString(), record.Text("after"));
        Assert.Equal(by.Value, record["by"]!.GetValue<Guid>());
    }

    private static Task CannotSetNegativePrice(Api commercial, BookId book) =>
        commercial.Refused(HttpStatusCode.UnprocessableEntity, HttpMethod.Post, $"books/{book.Value}/price",
            new { newPrice = Uah(-1m) });
}
