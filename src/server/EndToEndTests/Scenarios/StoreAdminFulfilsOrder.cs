namespace EndToEndTests.Scenarios;

/// <summary>Scenario 2: the store administrator fulfils an online order (FR-07, FR-08, FR-18, scenarios 3.8, 3.10, 3.11).</summary>
[Collection(EndToEndCollection.Name)]
public sealed class StoreAdminFulfilsOrder(SqlServerFixture sql) : EndToEndTest(sql)
{
    [Fact]
    public async Task Store_admin_takes_an_order_from_new_to_issued()
    {
        await Preseed(Sample.Standard);
        var customer = Anonymous();
        await AddsToCart(customer, World.Kobzar, quantity: 2);
        var order = await PlacesPickupOrder(customer, World.StoreA);

        var admin = await LogsIn(SampleUsers.StoreAdmin);
        await FindsOrderInList(admin, World.StoreA, order.Id, status: "New");
        await OpensOrder(admin, order.Id, total: 600m, historyEntries: 0);
        await SeesStock(admin, World.StoreA, World.Kobzar, onHand: 10, reserved: 2);
        await MovesOrderThrough(admin, order.Id, "Confirmed", "Picking", "Ready");
        CustomerWasNotified(NotificationKind.OrderReady);
        await MovesOrderThrough(admin, order.Id, "Issued");
        await SeesStock(admin, World.StoreA, World.Kobzar, onHand: 8, reserved: 0);
        await SeesOrderHistoryBy(admin, order.Id, UserOf(SampleUsers.StoreAdmin), "Confirmed", "Picking", "Ready", "Issued");
        await CannotMoveOrderTo(admin, order.Id, "Picking");
        await TracksOrder(customer, order, status: "Issued", changes: 4);

        var otherStoreAdmin = await LogsIn(SampleUsers.StoreAdminB);
        await CannotOpenOrder(otherStoreAdmin, order.Id);

        await LogsOut(admin);
        await IsSignedOut(admin);
    }

    private static async Task FindsOrderInList(Api admin, LocationId store, Guid order, string status)
    {
        var orders = await admin.Get($"locations/{store.Value}/orders");
        Assert.Equal(status, orders.Items().With("id", order).Text("status"));
    }

    private static async Task OpensOrder(Api admin, Guid order, decimal total, int historyEntries)
    {
        var card = await admin.Get($"orders/{order}");
        Assert.Equal(total, card.Amount("total"));
        Assert.Equal(historyEntries, card.Items("history").Count);
    }

    private static async Task MovesOrderThrough(Api admin, Guid order, params string[] statuses)
    {
        foreach (var status in statuses)
            await admin.Post($"orders/{order}/status", new { status });
    }

    private void CustomerWasNotified(NotificationKind kind) =>
        Assert.Contains(Notifications, n => n.Kind == kind && n.Customer == World.Customer);

    private static async Task SeesOrderHistoryBy(Api admin, Guid order, UserId by, params string[] statuses) =>
        AssertHistory(await admin.Get($"orders/{order}"), statuses.Select(s => (s, by)).ToArray());

    private static Task CannotMoveOrderTo(Api admin, Guid order, string status) =>
        admin.Refused(HttpStatusCode.UnprocessableEntity, HttpMethod.Post, $"orders/{order}/status", new { status });

    private static Task CannotOpenOrder(Api admin, Guid order) =>
        admin.Refused(HttpStatusCode.Forbidden, HttpMethod.Get, $"orders/{order}");

    private static Task LogsOut(Api employee) => employee.Post("auth/logout");
}
