namespace EndToEndTests.Scenarios;

/// <summary>Scenario 6: a transfer from the warehouse to Store B with a shortfall (FR-10, scenario 3.7).</summary>
[Collection(EndToEndCollection.Name)]
public sealed class TransferBetweenLocations(SqlServerFixture sql) : EndToEndTest(sql)
{
    [Fact]
    public async Task Short_delivery_of_a_transfer_raises_a_discrepancy()
    {
        await Preseed(Sample.Standard);

        var keeper = await LogsIn(SampleUsers.Keeper);
        var transfer = await CreatesTransfer(keeper, World.StoreB, (World.Kobzar, 5), (World.Dune, 3));
        await CannotShipTransfer(keeper, transfer);
        await ApprovesTransfer(keeper, transfer);
        await SeesStock(keeper, World.Warehouse, World.Kobzar, onHand: 50, reserved: 5);
        await ShipsTransfer(keeper, transfer);
        await SeesStock(keeper, World.Warehouse, World.Kobzar, onHand: 45, reserved: 0);

        var receiver = await LogsIn(SampleUsers.StoreAdminB);
        await ReceivesTransfer(receiver, transfer, (World.Kobzar, 5), (World.Dune, 2));
        await SeesStock(receiver, World.StoreB, World.Dune, onHand: 2, reserved: 0);
        await SeesTransferFlaggedForDiscrepancy(receiver, World.StoreB, transfer);
        await SeesTransferDiscrepancy(receiver, transfer, World.Dune, expected: 3, actual: 2);
        await ResolvesDiscrepancy(receiver, transfer, "Недостача від складу");
        await SeesDiscrepancyResolved(receiver, transfer, "Недостача від складу", UserOf(SampleUsers.StoreAdminB));
        await SeesTransferHistory(keeper, transfer, keeper: UserOf(SampleUsers.Keeper), receiver: UserOf(SampleUsers.StoreAdminB));

        var outsider = await LogsIn(SampleUsers.StoreAdmin);
        await CannotOpenTransfer(outsider, transfer);
    }

    private async Task<Guid> CreatesTransfer(Api keeper, LocationId to, params (BookId Book, int Quantity)[] items) =>
        (await keeper.Create("transfers", new
        {
            from = World.Warehouse.Value, to = to.Value,
            items = items.Select(i => new { book = i.Book.Value, quantity = i.Quantity }),
        })).Id();

    private static Task ApprovesTransfer(Api keeper, Guid transfer) => keeper.Post($"transfers/{transfer}/approve");

    private static Task ShipsTransfer(Api keeper, Guid transfer) => keeper.Post($"transfers/{transfer}/ship");

    private static Task CannotShipTransfer(Api keeper, Guid transfer) =>
        keeper.Rejected("transfer-status-invalid", HttpMethod.Post, $"transfers/{transfer}/ship");

    private static Task ReceivesTransfer(Api receiver, Guid transfer, params (BookId Book, int Quantity)[] received) =>
        receiver.Post($"transfers/{transfer}/receive",
            new { received = received.Select(r => new { book = r.Book.Value, quantity = r.Quantity }) });

    private static async Task SeesTransferFlaggedForDiscrepancy(Api receiver, LocationId store, Guid transfer)
    {
        var row = (await receiver.Get($"locations/{store.Value}/transfers")).Items().With("id", transfer);
        Assert.Equal("Received", row.Text("status"));
        Assert.True(row["hasOpenDiscrepancies"]!.GetValue<bool>());
    }

    private static async Task SeesTransferDiscrepancy(Api receiver, Guid transfer, BookId book, int expected, int actual)
    {
        var discrepancy = (await receiver.Get($"transfers/{transfer}")).Items("discrepancies").Single();
        Assert.Equal(book.Value, discrepancy["book"]!.GetValue<Guid>());
        Assert.Equal(expected, discrepancy.Number("expected"));
        Assert.Equal(actual, discrepancy.Number("actual"));
    }

    private static async Task ResolvesDiscrepancy(Api receiver, Guid transfer, string reason)
    {
        var discrepancy = (await receiver.Get($"transfers/{transfer}")).Items("discrepancies").Single().Id();
        await receiver.Post($"transfers/{transfer}/discrepancies/{discrepancy}/resolve", new { reason });
    }

    private static async Task SeesDiscrepancyResolved(Api receiver, Guid transfer, string reason, UserId by)
    {
        var discrepancy = (await receiver.Get($"transfers/{transfer}")).Items("discrepancies").Single();
        Assert.True(discrepancy["isResolved"]!.GetValue<bool>());
        Assert.Equal(reason, discrepancy.Text("reason"));
        Assert.Equal(by.Value, discrepancy["resolvedBy"]!.GetValue<Guid>());
    }

    private static async Task SeesTransferHistory(Api employee, Guid transfer, UserId keeper, UserId receiver) =>
        AssertHistory(await employee.Get($"transfers/{transfer}"),
            ("Approved", keeper), ("Shipped", keeper), ("Received", receiver));

    private static Task CannotOpenTransfer(Api employee, Guid transfer) =>
        employee.Refused(HttpStatusCode.Forbidden, HttpMethod.Get, $"transfers/{transfer}");
}
