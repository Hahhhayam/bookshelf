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
        await CannotSellWhileTillIsClosed(cashier, World.Notebook, unitPrice: 50m);
        var shift = await OpensShift(World.StoreA);
        await SeesTillOpen(cashier, shift);

        await FindsCustomerByCard(cashier, bonusBalance: 0, purchases: 0);
        await FindsBookByIsbn(cashier, World.Dune, "9780441013593");
        await QuotesReceipt(cashier, total: 705m, promotionDiscount: 45m, bonusAllowed: 0m, (World.Kobzar, 1), (World.Dune, 1));
        var sale = await SellsForCashWithChange(cashier, "till-1/0001", total: 705m, tendered: 1000m,
            (World.Kobzar, 1), (World.Dune, 1));
        await ResendsSaleAndGetsSameReceipt(cashier, "till-1/0001", sale, total: 705m, (World.Kobzar, 1), (World.Dune, 1));
        await SeesReceipt(cashier, sale, total: 705m, tendered: 1000m, change: 295m);
        await SeesOwnReceipts(cashier, sale);
        await SeesStock(cashier, World.StoreA, World.Dune, onHand: 4, reserved: 0);
        await FindsCustomerByCard(cashier, bonusBalance: 7, purchases: 1);
        await ShopperSeesOwnBonuses(Anonymous(), balance: 7, tier: "Basic");
        await QuotesReceipt(cashier, total: 50m, promotionDiscount: 0m, bonusAllowed: 7m, (World.Notebook, 1));
        await CannotSellMoreThanAvailable(cashier, World.Notebook, quantity: 21, unitPrice: 50m);
    }

    private Task CannotSellWhileTillIsClosed(Api cashier, BookId book, decimal unitPrice) =>
        cashier.Rejected("shift-not-open", HttpMethod.Post, "sales",
            SaleBody(null, unitPrice, (book, 1)), IdempotencyKey($"closed-{Guid.NewGuid():N}"));

    private async Task SeesTillOpen(Api cashier, Guid shift)
    {
        var open = await cashier.Get($"locations/{World.StoreA.Value}/shift");
        Assert.True(open["open"]!.GetValue<bool>());
        Assert.Equal(shift, open.Id());
    }

    /// <summary>The till learns the total after promotions and the allowed bonus write-off before payment.</summary>
    private async Task QuotesReceipt(
        Api cashier, decimal total, decimal promotionDiscount, decimal bonusAllowed, params (BookId Book, int Quantity)[] items)
    {
        var quote = await cashier.Compute("sales/quote", new
        {
            location = World.StoreA.Value, customer = World.Customer.Value,
            items = items.Select(i => new { book = i.Book.Value, quantity = i.Quantity, manualDiscount = (object?)null }),
        });
        Assert.Equal(total, quote.Amount("total"));
        Assert.Equal(promotionDiscount, quote.Items("lines").Sum(l => l["discount"]!.Amount("amount")));
        Assert.Equal(bonusAllowed, quote["bonus"]!.Amount("allowed"));
    }

    private async Task<Guid> SellsForCashWithChange(
        Api cashier, string idempotencyKey, decimal total, decimal tendered, params (BookId Book, int Quantity)[] items) =>
        (await cashier.Create("sales", new
        {
            location = World.StoreA.Value, customer = World.Customer.Value,
            items = items.Select(i => new { book = i.Book.Value, quantity = i.Quantity, manualDiscount = (object?)null }),
            payments = new[]
            {
                new { method = "Cash", amount = Uah(total), giftCertificateNumber = (string?)null, tendered = Uah(tendered) },
            },
        }, IdempotencyKey(idempotencyKey))).Id();

    private static async Task SeesReceipt(Api cashier, Guid sale, decimal total, decimal tendered, decimal change)
    {
        var receipt = await cashier.Get($"sales/{sale}");
        Assert.Equal(total, receipt.Amount("total"));
        var cash = receipt.Items("payments").Single();
        Assert.Equal(tendered, cash.Amount("tendered"));
        Assert.Equal(change, cash.Amount("change"));
    }

    private async Task SeesOwnReceipts(Api cashier, Guid sale)
    {
        var receipts = await cashier.Get(Query.Of($"locations/{World.StoreA.Value}/sales",
            ("from", Now.AddHours(-1)), ("to", Now.AddHours(1)), ("cashier", UserOf(SampleUsers.Cashier).Value)));
        Assert.Equal(sale, receipts.Items().Single().Id());
    }

    /// <summary>The shop has no customer login, so the public bonus read carries no personal data.</summary>
    private async Task ShopperSeesOwnBonuses(Api shop, int balance, string tier)
    {
        var bonuses = await shop.Get($"customers/{World.Customer.Value}/bonuses");
        Assert.Equal(balance, bonuses.Number("balance"));
        Assert.Equal(tier, bonuses.Text("tier"));
        Assert.Equal("Accrual", bonuses.Items("operations").Single().Text("kind"));
        Assert.Null(bonuses["name"]);
        Assert.Null(bonuses["phone"]);
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
        cashier.Rejected("stock-insufficient", HttpMethod.Post, "sales",
            SaleBody(null, unitPrice * quantity, (book, quantity)), IdempotencyKey($"refused-{Guid.NewGuid():N}"));
}
