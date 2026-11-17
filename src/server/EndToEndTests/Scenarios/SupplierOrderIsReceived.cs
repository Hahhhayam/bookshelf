namespace EndToEndTests.Scenarios;

/// <summary>Scenario 7: a late supplier order received in two deliveries (FR-11, FR-12, FR-18, scenario 3.9).</summary>
[Collection(EndToEndCollection.Name)]
public sealed class SupplierOrderIsReceived(SqlServerFixture sql) : EndToEndTest(sql)
{
    [Fact]
    public async Task Overdue_order_is_received_in_two_deliveries()
    {
        await Preseed(Sample.Standard);

        var purchasing = await LogsIn(SampleUsers.Purchasing);
        var order = await CreatesOrderDueDaysAgo(purchasing, 3, (World.Kobzar, 20, 150m), (World.Dune, 10, 200m));
        await SendsOrder(purchasing, order);
        await SeesOrderAmongOverdue(purchasing, order);

        var keeper = await LogsIn(SampleUsers.Keeper);
        var first = await ReceivesDelivery(keeper, "delivery-1", order, (World.Kobzar, 20));
        await ResendsDeliveryAndGetsTheSameReceipt(keeper, "delivery-1", order, first, (World.Kobzar, 20));
        await SeesOrderStatus(purchasing, order, "PartlyReceived");
        await SeesReceiptDiscrepancy(keeper, first, World.Dune, ordered: 10, received: 0);
        await ReceivesDelivery(keeper, "delivery-2", order, (World.Dune, 10));
        await SeesReceiptsAtWarehouse(keeper, count: 2);
        await SeesOrderStatus(purchasing, order, "Received");
        await SeesOrderHistory(purchasing, order, purchaser: UserOf(SampleUsers.Purchasing), keeper: UserOf(SampleUsers.Keeper));
        await SeesStock(purchasing, World.Warehouse, World.Kobzar, onHand: 70, reserved: 0);
        await DoesNotSeeOrderAmongOverdue(purchasing, order);
    }

    private async Task<Guid> CreatesOrderDueDaysAgo(
        Api purchasing, int days, params (BookId Book, int Quantity, decimal Price)[] lines) =>
        (await purchasing.Create("purchase-orders", new
        {
            supplier = World.Supplier.Value,
            expectedDate = DateOnly.FromDateTime(Now.UtcDateTime.AddDays(-days)),
            lines = lines.Select(l => new { book = l.Book.Value, quantity = l.Quantity, purchasePrice = Uah(l.Price) }),
        })).Id();

    private static Task SendsOrder(Api purchasing, Guid order) => purchasing.Post($"purchase-orders/{order}/send");

    private static async Task SeesOrderAmongOverdue(Api purchasing, Guid order)
    {
        var overdue = await purchasing.Get(Query.Of("purchase-orders", ("overdue", true)));
        Assert.True(overdue.Items().With("id", order)["isOverdue"]!.GetValue<bool>());
    }

    private static async Task DoesNotSeeOrderAmongOverdue(Api purchasing, Guid order)
    {
        var overdue = await purchasing.Get(Query.Of("purchase-orders", ("overdue", true)));
        Assert.DoesNotContain(overdue.Items(), o => o.Id() == order);
    }

    private async Task<Guid> ReceivesDelivery(
        Api keeper, string key, Guid purchaseOrder, params (BookId Book, int Quantity)[] received) =>
        (await keeper.Create("deliveries", new
        {
            location = World.Warehouse.Value, purchaseOrder, supplier = (Guid?)null,
            received = received.Select(r => new { book = r.Book.Value, quantity = r.Quantity }),
        }, IdempotencyKey(key))).Id();

    /// <summary>A resend after a lost answer carries the same key, so the goods are not received twice.</summary>
    private async Task ResendsDeliveryAndGetsTheSameReceipt(
        Api keeper, string key, Guid purchaseOrder, Guid receipt, params (BookId Book, int Quantity)[] received) =>
        Assert.Equal(receipt, await ReceivesDelivery(keeper, key, purchaseOrder, received));

    private static async Task SeesReceiptDiscrepancy(Api keeper, Guid receipt, BookId book, int ordered, int received)
    {
        var discrepancy = (await keeper.Get($"deliveries/{receipt}")).Items("discrepancies").Single();
        Assert.Equal(book.Value, discrepancy["book"]!.GetValue<Guid>());
        Assert.Equal(ordered, discrepancy.Number("ordered"));
        Assert.Equal(received, discrepancy.Number("received"));
    }

    private async Task SeesReceiptsAtWarehouse(Api keeper, int count)
    {
        var receipts = await keeper.Get(Query.Of("deliveries", ("location", World.Warehouse.Value)));
        Assert.Equal(count, receipts.Items().Count);
    }

    private static async Task SeesOrderStatus(Api purchasing, Guid order, string status) =>
        Assert.Equal(status, (await purchasing.Get($"purchase-orders/{order}")).Text("status"));

    private static async Task SeesOrderHistory(Api purchasing, Guid order, UserId purchaser, UserId keeper) =>
        AssertHistory(await purchasing.Get($"purchase-orders/{order}"),
            ("Draft", purchaser), ("Sent", purchaser), ("PartlyReceived", keeper), ("Received", keeper));
}
