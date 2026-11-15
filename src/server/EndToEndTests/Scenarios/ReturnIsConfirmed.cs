namespace EndToEndTests.Scenarios;

/// <summary>Scenario 4: a return created by the cashier and confirmed by the administrator (FR-05, NFR Audit, scenario 3.6).</summary>
[Collection(EndToEndCollection.Name)]
public sealed class ReturnIsConfirmed(SqlServerFixture sql) : EndToEndTest(sql)
{
    [Fact]
    public async Task Return_changes_stock_and_bonuses_only_after_confirmation()
    {
        await Preseed(Sample.Standard);
        var cashier = await LogsIn(SampleUsers.Cashier);
        var sale = await Sells(cashier, "till-1/0001", total: 705m, (World.Kobzar, 1), (World.Dune, 1));

        var ret = await CreatesReturn(cashier, sale, World.Kobzar, quantity: 1);
        await SeesStock(cashier, World.StoreA, World.Kobzar, onHand: 9, reserved: 0);
        await CannotConfirmReturn(cashier, ret);

        var admin = await LogsIn(SampleUsers.StoreAdmin);
        await ConfirmsReturn(admin, ret);
        await SeesStock(admin, World.StoreA, World.Kobzar, onHand: 10, reserved: 0);
        await SeesConfirmedReturnInAudit(admin, ret, by: UserOf(SampleUsers.StoreAdmin));
        await FindsCustomerByCard(cashier, bonusBalance: 4, purchases: 1);
        await CannotReturn(cashier, sale, World.Dune, quantity: 2);

        TimePasses(TimeSpan.FromDays(8));
        cashier = await LogsIn(SampleUsers.Cashier);
        await CannotReturn(cashier, sale, World.Dune, quantity: 1);
    }

    private static async Task<Guid> CreatesReturn(Api cashier, Guid sale, BookId book, int quantity) =>
        (await cashier.Create("returns", ReturnBody(sale, book, quantity))).Id();

    private static Task CannotConfirmReturn(Api cashier, Guid ret) =>
        cashier.Refused(HttpStatusCode.Forbidden, HttpMethod.Post, $"returns/{ret}/confirm");

    private static Task ConfirmsReturn(Api admin, Guid ret) => admin.Post($"returns/{ret}/confirm");

    private static async Task SeesConfirmedReturnInAudit(Api admin, Guid ret, UserId by)
    {
        var records = await admin.Get(Query.Of("audit", ("subject", ret), ("action", "return.confirmed")));
        Assert.Equal(by.Value, records.Items().Single()["by"]!.GetValue<Guid>());
    }

    /// <summary>Refused when it exceeds what was sold minus earlier returns, or when the return period is over.</summary>
    private static Task CannotReturn(Api cashier, Guid sale, BookId book, int quantity) =>
        cashier.Refused(HttpStatusCode.UnprocessableEntity, HttpMethod.Post, "returns", ReturnBody(sale, book, quantity));

    private static object ReturnBody(Guid sale, BookId book, int quantity) => new
    {
        sale, items = new[] { new { book = book.Value, quantity } }, reason = "Changed mind", condition = "Good",
    };
}
