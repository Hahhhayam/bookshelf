using Microsoft.Extensions.DependencyInjection;

namespace EndToEndTests.Hosting;

/// <summary>
/// A scenario runs against its own app and database. Its test method preseeds a sample and then reads as a chain of
/// steps; how each step calls the API and checks the response lives in private methods of the scenario, or here
/// when several scenarios share it.
/// </summary>
public abstract class EndToEndTest(SqlServerFixture sql) : IAsyncLifetime
{
    private readonly BookstoreApp _app = new(sql.ConnectionStringForNewDatabase());

    protected SampleWorld World { get; private set; } = null!;
    protected DateTimeOffset Now => _app.Clock.Now;
    protected IReadOnlyCollection<SentNotification> Notifications => _app.Notifications.Sent;

    public Task InitializeAsync() => Task.CompletedTask;

    public async Task DisposeAsync() => await _app.DisposeAsync();

    protected async Task<SampleWorld> Preseed(Func<IServiceProvider, Task<SampleWorld>> sample)
    {
        using var scope = _app.Services.CreateScope();
        World = await sample(scope.ServiceProvider);
        return World;
    }

    protected void TimePasses(TimeSpan time) => _app.Clock.Advance(time);

    /// <summary>Scheduled jobs are off in tests (see <see cref="BookstoreApp"/>), so a scenario runs a job's use case itself.</summary>
    protected async Task ScheduledJobRuns<TJob>(Func<TJob, CancellationToken, Task> run) where TJob : notnull
    {
        using var scope = _app.Services.CreateScope();
        await run(scope.ServiceProvider.GetRequiredService<TJob>(), CancellationToken.None);
    }

    protected Api Anonymous() => _app.Anonymous();

    protected Task<Api> LogsIn(string login, string password = SampleUsers.Password) => _app.LoginAsync(login, password);

    protected Task CannotLogIn(string login, string password, HttpStatusCode status) =>
        Anonymous().Refused(status, HttpMethod.Post, "auth/login", new { login, password });

    protected UserId UserOf(string login) => World.Users[login];

    protected Task AddsToCart(Api customer, BookId book, int quantity) =>
        customer.Post($"customers/{World.Customer.Value}/cart/items", new { book = book.Value, quantity });

    protected async Task<PlacedOrderRef> PlacesPickupOrder(Api customer, LocationId store)
    {
        var placed = await customer.Create("orders", new
        {
            customer = World.Customer.Value, type = "Retail", stockLocation = store.Value,
            fulfilment = new { kind = "Pickup", pickupLocation = store.Value, deliveryAddress = (string?)null },
        });
        return new PlacedOrderRef(placed.Id(), placed.Text("pickupCode"));
    }

    /// <summary>The public tracking page shows only the status and when it changed, never staff or personal data.</summary>
    protected static async Task TracksOrder(Api customer, PlacedOrderRef order, string status, int changes)
    {
        var tracked = await customer.Get($"orders/track/{order.PickupCode}");
        Assert.Equal(status, tracked.Text("status"));
        Assert.Equal(changes, tracked.Items("history").Count);
        Assert.Null(tracked["customer"]);
        Assert.All(tracked.Items("history"), h => Assert.Null(h["by"]));
    }

    /// <summary>The store administrator opens the till; a store sells only during an open shift (scenario 3.5).</summary>
    protected async Task<Guid> OpensShift(LocationId store)
    {
        var storeAdmin = await LogsIn(SampleUsers.StoreAdmin);
        return (await storeAdmin.Create($"locations/{store.Value}/shifts", new { })).Id();
    }

    /// <summary>Pays the whole receipt in cash, so <paramref name="total"/> must be the total after promotions.</summary>
    protected async Task<Guid> Sells(Api cashier, string idempotencyKey, decimal total, params (BookId Book, int Quantity)[] items) =>
        (await cashier.Create("sales", SaleBody(World.Customer, total, items), IdempotencyKey(idempotencyKey))).Id();

    protected async Task FindsCustomerByCard(Api cashier, int bonusBalance, int purchases)
    {
        var card = await cashier.Get(Query.Of("customers", ("card", World.CustomerCard)));
        Assert.Equal(World.Customer.Value, card.Id());
        Assert.Equal(bonusBalance, card.Number("bonusBalance"));
        Assert.Equal(purchases, card.Items("purchases").Count);
    }

    protected static async Task SeesStock(Api employee, LocationId location, BookId book, int onHand, int reserved)
    {
        var line = (await employee.Get(Query.Of($"locations/{location.Value}/stock", ("book", book.Value)))).Items().Single();
        Assert.Equal(onHand, line.Number("onHand"));
        Assert.Equal(reserved, line.Number("reserved"));
        Assert.Equal(onHand - reserved, line.Number("available"));
    }

    protected static Task CannotChangePrice(Api employee, BookId book) =>
        employee.Refused(HttpStatusCode.Forbidden, HttpMethod.Post, $"books/{book.Value}/price", new { newPrice = Uah(1m) });

    protected Task IsSignedOut(Api employee) =>
        employee.Refused(HttpStatusCode.Unauthorized, HttpMethod.Get, $"locations/{World.StoreA.Value}/stock");

    protected object SaleBody(CustomerId? customer, decimal total, params (BookId Book, int Quantity)[] items) => new
    {
        location = World.StoreA.Value, customer = customer?.Value,
        items = items.Select(i => new { book = i.Book.Value, quantity = i.Quantity, manualDiscount = (object?)null }),
        payments = new[] { new { method = "Cash", amount = Uah(total), giftCertificateNumber = (string?)null } },
    };

    /// <summary>Every sale carries an operation key, so a resend from the till is posted only once.</summary>
    protected static Dictionary<string, string> IdempotencyKey(string key) => new() { ["Idempotency-Key"] = key };

    protected static object Uah(decimal amount) => new { amount, currency = "UAH" };

    /// <summary>A card's status history, in order, with the user behind each change.</summary>
    protected static void AssertHistory(JsonNode card, params (string Status, UserId By)[] expected) =>
        Assert.Equal(expected.Select(e => (e.Status, e.By.Value)),
            card.Items("history").Select(h => (h.Text("to"), h["by"]!.GetValue<Guid>())));
}
