using Application.Catalog;

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

    [Fact]
    public async Task Scheduled_price_starts_at_its_moment_and_the_old_one_stays_in_history()
    {
        await Preseed(Sample.Standard);

        var commercial = await LogsIn(SampleUsers.Commercial);
        await SchedulesPrice(commercial, World.Kobzar, newPrice: 400m, from: Now.AddDays(1));
        await SeesScheduledPrice(commercial, World.Kobzar, price: 300m, scheduled: 400m);

        TimePasses(TimeSpan.FromDays(1) + TimeSpan.FromMinutes(1));
        await ScheduledJobRuns<ApplyScheduledPricesUseCase>((job, ct) => job.ExecuteAsync(ct));
        await OpensBookCard(commercial, World.Kobzar, price: 400m);
        await ChecksPriceHistory(commercial, World.Kobzar, 300m, 400m);
    }

    private static async Task OpensBookCard(Api employee, BookId book, decimal price) =>
        Assert.Equal(price, (await employee.Get($"books/{book.Value}")).Amount("price"));

    private static Task ChangesPrice(Api commercial, BookId book, decimal newPrice) =>
        commercial.Post($"books/{book.Value}/price", new { newPrice = Uah(newPrice) });

    private static Task SchedulesPrice(Api commercial, BookId book, decimal newPrice, DateTimeOffset from) =>
        commercial.Post($"books/{book.Value}/price", new { newPrice = Uah(newPrice), effectiveFrom = from });

    private static async Task SeesScheduledPrice(Api employee, BookId book, decimal price, decimal scheduled)
    {
        var card = await employee.Get($"books/{book.Value}");
        Assert.Equal(price, card.Amount("price"));
        Assert.Equal(scheduled, card["scheduledPrice"]!.Amount("price"));
    }

    private static async Task ChecksPriceHistory(Api employee, BookId book, params decimal[] prices)
    {
        var history = await employee.Get($"books/{book.Value}/prices");
        Assert.Equal(prices, history.Items().Select(e => e.Amount("price")));
    }

    /// <summary>The audit keeps prices as the server formats money, so the expectation is formatted the same way.</summary>
    private static async Task SeesPriceChangeInAudit(Api commercial, BookId book, decimal before, decimal after, UserId by)
    {
        var records = await commercial.Get(Query.Of("audit", ("subject", book.Value), ("action", "book.price-changed")));
        var change = records.Items().Single().Items("changes").Single();
        Assert.Equal("price", change.Text("field"));
        Assert.Equal(new Money(before, CurrencyCode.Uah).ToString(), change.Text("before"));
        Assert.Equal(new Money(after, CurrencyCode.Uah).ToString(), change.Text("after"));
        Assert.Equal(by.Value, records.Items().Single()["by"]!.GetValue<Guid>());
    }

    private static Task CannotSetNegativePrice(Api commercial, BookId book) =>
        commercial.Rejected("price-negative", HttpMethod.Post, $"books/{book.Value}/price",
            new { newPrice = Uah(-1m) });
}
