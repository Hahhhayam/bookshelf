namespace EndToEndTests.Scenarios;

/// <summary>Scenario 8: the management report, chain-wide and per store (FR-16, scenario 3.12).</summary>
[Collection(EndToEndCollection.Name)]
public sealed class ChainManagerReadsReport(SqlServerFixture sql) : EndToEndTest(sql)
{
    [Fact]
    public async Task Report_figures_match_the_day_sales()
    {
        await Preseed(Sample.Standard);
        await OpensShift(World.StoreA);
        var cashier = await LogsIn(SampleUsers.Cashier);
        await Sells(cashier, "till-1/0001", total: 705m, (World.Kobzar, 1), (World.Dune, 1));
        await Sells(cashier, "till-1/0002", total: 100m, (World.Notebook, 2));

        var manager = await LogsIn(SampleUsers.ChainManager);
        await SeesChainReport(manager, revenue: 805m, receipts: 2, averageCheck: 402.5m);
        await ComparesWithPreviousPeriod(manager, previousRevenue: 0m, previousReceipts: 0);
        await SeesTheDayAsPreviousPeriodOfTheNextDay(manager, revenue: 805m, receipts: 2);
        await SeesCategoryRevenue(manager, World.Fiction, revenue: 705m);
        await SeesStoreRevenue(manager, World.StoreA, revenue: 805m);
        await SeesAbcClasses(manager, (World.Dune, "A"), (World.Kobzar, "A"), (World.Notebook, "B"));
        await DownloadsReportCsv(manager);

        var storeAdmin = await LogsIn(SampleUsers.StoreAdmin);
        await CannotSeeChainWideReport(storeAdmin);
        await SeesOwnStoreReport(storeAdmin, World.StoreA);
    }

    private string Report(params (string Name, object? Value)[] filters) =>
        Query.Of("reports/management", [("from", Now.AddDays(-1)), ("to", Now.AddDays(1)), .. filters]);

    private async Task SeesChainReport(Api manager, decimal revenue, int receipts, decimal averageCheck)
    {
        var report = await manager.Get(Report());
        Assert.Equal(revenue, report.Amount("revenue"));
        Assert.Equal(receipts, report.Number("receipts"));
        Assert.Equal(averageCheck, report.Amount("averageCheck"));
    }

    /// <summary>The report compares itself with the equally long period right before it (table 1.1).</summary>
    private async Task ComparesWithPreviousPeriod(Api manager, decimal previousRevenue, int previousReceipts)
    {
        var previous = (await manager.Get(Report()))["previousPeriod"]!;
        Assert.Equal(previousRevenue, previous.Amount("revenue"));
        Assert.Equal(previousReceipts, previous.Number("receipts"));
    }

    /// <summary>Starts an hour ahead: query times go out in whole seconds, so a boundary at "now" could cut the sales off.</summary>
    private async Task SeesTheDayAsPreviousPeriodOfTheNextDay(Api manager, decimal revenue, int receipts)
    {
        var nextDay = Query.Of("reports/management", ("from", Now.AddHours(1)), ("to", Now.AddDays(1).AddHours(1)));
        var report = await manager.Get(nextDay);
        Assert.Equal(0, report.Number("receipts"));
        Assert.Equal(revenue, report["previousPeriod"]!.Amount("revenue"));
        Assert.Equal(receipts, report["previousPeriod"]!.Number("receipts"));
    }

    private async Task SeesCategoryRevenue(Api manager, CategoryId category, decimal revenue) =>
        Assert.Equal(revenue, (await manager.Get(Report(("category", category.Value)))).Amount("revenue"));

    private async Task SeesStoreRevenue(Api manager, LocationId store, decimal revenue)
    {
        var report = await manager.Get(Report(("locations", store.Value)));
        Assert.Equal(revenue, report.Items("stores").With("location", store.Value).Amount("revenue"));
    }

    private async Task SeesAbcClasses(Api manager, params (BookId Book, string Class)[] expected)
    {
        var abc = (await manager.Get(Report())).Items("abc");
        Assert.Equal(expected.Select(e => (e.Book.Value, e.Class)),
            abc.Select(a => (a["book"]!.GetValue<Guid>(), a.Text("class"))));
    }

    private async Task DownloadsReportCsv(Api manager)
    {
        var csv = await manager.GetText(Report().Replace("reports/management", "reports/management.csv"));
        foreach (var section in new[] { "Top books", "Stores", "Categories", "ABC analysis", "Shortages", "Slow-moving books" })
            Assert.Contains(section, csv);
    }

    private Task CannotSeeChainWideReport(Api storeAdmin) =>
        storeAdmin.Refused(HttpStatusCode.Forbidden, HttpMethod.Get, Report());

    private async Task SeesOwnStoreReport(Api storeAdmin, LocationId store) =>
        await storeAdmin.Get(Report(("locations", store.Value)));
}
