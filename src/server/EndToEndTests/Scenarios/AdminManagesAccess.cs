namespace EndToEndTests.Scenarios;

/// <summary>Scenario 9: users and access rights (FR-01, FR-19, NFR Security, NFR Audit, scenario 3.1).</summary>
[Collection(EndToEndCollection.Name)]
public sealed class AdminManagesAccess(SqlServerFixture sql) : EndToEndTest(sql)
{
    [Fact]
    public async Task Access_changes_and_blocking_apply_immediately()
    {
        await Preseed(Sample.Standard);

        var admin = await LogsIn(SampleUsers.Admin);
        var role = await CreatesRole(admin, "Junior cashier", Permissions.SalesCreate);
        var user = await CreatesUser(admin, "junior", "Junior#1", role, World.StoreA);

        var junior = await LogsIn("junior", "Junior#1");
        await SeesOwnProfile(junior, "junior", [Permissions.SalesCreate], World.StoreA);
        await CanSeeStock(junior, World.StoreA);
        await CannotChangePrice(junior, World.Kobzar);
        await CannotSeeStock(junior, World.StoreB);

        await GivesAccess(admin, user, role, World.StoreA, World.StoreB);
        await SeesOwnProfile(junior, "junior", [Permissions.SalesCreate], World.StoreA, World.StoreB);
        await CanSeeStock(junior, World.StoreB);

        await CannotLogIn("junior", "wrong password", HttpStatusCode.Unauthorized);
        await SeesFailedLoginWithoutPassword(admin, "junior", "wrong password");

        await BlocksUser(admin, user);
        await IsSignedOut(junior);
        await CannotLogIn("junior", "Junior#1", HttpStatusCode.Forbidden);
        await SeesUserChangesInAudit(admin, user, by: UserOf(SampleUsers.Admin),
            "user.created", "user.access-changed", "user.blocked");
    }

    /// <summary>The profile the client builds its navigation from follows access changes without a new login.</summary>
    private static async Task SeesOwnProfile(Api employee, string login, string[] permissions, params LocationId[] locations)
    {
        var profile = await employee.Get("auth/me");
        Assert.Equal(login, profile.Text("login"));
        Assert.Equal(permissions, profile.Items("permissions").Select(p => p.GetValue<string>()));
        Assert.Equal(locations.Select(l => l.Value).Order(), profile.Items("locations").Select(l => l.Id()).Order());
    }

    private static async Task<Guid> CreatesRole(Api admin, string name, params string[] permissions) =>
        (await admin.Create("roles", new { name, permissions })).Id();

    private static async Task<Guid> CreatesUser(Api admin, string login, string password, Guid role, params LocationId[] locations) =>
        (await admin.Create("users", new
        {
            login, password, roles = new[] { role }, locations = locations.Select(l => l.Value),
        })).Id();

    private static Task GivesAccess(Api admin, Guid user, Guid role, params LocationId[] locations) =>
        admin.Put($"users/{user}/access", new { roles = new[] { role }, locations = locations.Select(l => l.Value) });

    private static Task BlocksUser(Api admin, Guid user) => admin.Post($"users/{user}/block");

    private static async Task CanSeeStock(Api employee, LocationId location) =>
        await employee.Get($"locations/{location.Value}/stock");

    private static Task CannotSeeStock(Api employee, LocationId location) =>
        employee.Refused(HttpStatusCode.Forbidden, HttpMethod.Get, $"locations/{location.Value}/stock");

    /// <summary>A failed login is logged with the login, but the entered password appears nowhere.</summary>
    private static async Task SeesFailedLoginWithoutPassword(Api admin, string login, string enteredPassword)
    {
        var records = await admin.Get(Query.Of("audit", ("action", "login.failed")));
        var record = Assert.Single(records.Items(), r => r["subject"]?.GetValue<string>() == login);
        Assert.DoesNotContain(enteredPassword, record.ToJsonString());
    }

    private static async Task SeesUserChangesInAudit(Api admin, Guid user, UserId by, params string[] actions)
    {
        var records = (await admin.Get(Query.Of("audit", ("subject", user)))).Items();
        Assert.Equal(actions.Order(), records.Select(r => r.Text("action")).Order());
        Assert.All(records, r => Assert.Equal(by.Value, r["by"]!.GetValue<Guid>()));
    }
}
