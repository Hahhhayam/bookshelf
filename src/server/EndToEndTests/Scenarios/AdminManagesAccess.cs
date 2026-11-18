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
        await SeesRoleInList(admin, role, "Junior cashier", Permissions.SalesCreate);
        await SeesUserInList(admin, user, "junior", role, World.StoreA);

        var junior = await LogsIn("junior", "Junior#1");
        await SeesOwnProfile(junior, "junior", [Permissions.SalesCreate], World.StoreA);
        await CanSeeStock(junior, World.StoreA);
        await NamesUsersAndLocations(junior, user, "junior", World.StoreB);
        await CannotChangePrice(junior, World.Kobzar);
        await CannotSeeStock(junior, World.StoreB);

        await GivesAccess(admin, user, role, World.StoreA, World.StoreB);
        await SeesOwnProfile(junior, "junior", [Permissions.SalesCreate], World.StoreA, World.StoreB);
        await CanSeeStock(junior, World.StoreB);

        await CannotLogIn("junior", "wrong password", HttpStatusCode.Unauthorized);
        await SeesFailedLoginWithoutPassword(admin, "junior", "wrong password");

        var everywhere = await LogsIn(SampleUsers.Everywhere);
        await SeesOwnProfile(everywhere, SampleUsers.Everywhere, [Permissions.SalesCreate],
            World.StoreA, World.StoreB, World.Warehouse);
        await CanSeeStock(everywhere, World.Warehouse);

        await BlocksUser(admin, user);
        await IsSignedOut(junior);
        await CannotLogIn("junior", "Junior#1", HttpStatusCode.Forbidden);
        await SeesUserChangesInAudit(admin, user, by: UserOf(SampleUsers.Admin), byLogin: SampleUsers.Admin,
            "user.created", "user.access-changed", "user.blocked");
        await SeesAccessChangeFieldByField(admin, user, World.StoreA, World.StoreB);
        await FiltersAuditByHalfPeriod(admin, user);
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

    private static async Task SeesUserChangesInAudit(Api admin, Guid user, UserId by, string byLogin, params string[] actions)
    {
        var records = (await admin.Get(Query.Of("audit", ("subject", user)))).Items();
        Assert.Equal(actions.Order(), records.Select(r => r.Text("action")).Order());
        Assert.All(records, r => Assert.Equal(by.Value, r["by"]!.GetValue<Guid>()));
        Assert.All(records, r => Assert.Equal(byLogin, r.Text("byLogin")));
    }

    /// <summary>FR-17: the key fields of the change, each with its value before and after.</summary>
    private static async Task SeesAccessChangeFieldByField(Api admin, Guid user, LocationId before, LocationId added)
    {
        var record = (await admin.Get(Query.Of("audit", ("subject", user), ("action", "user.access-changed")))).Items().Single();
        var change = Assert.Single(record.Items("changes"));
        Assert.Equal("locations", change.Text("field"));
        Assert.Equal(before.Value.ToString(), change.Text("before"));
        Assert.Contains(added.Value.ToString(), change.Text("after"));
    }

    /// <summary>A period open at one end applies that end alone.</summary>
    private async Task FiltersAuditByHalfPeriod(Api admin, Guid user)
    {
        Assert.NotEmpty((await admin.Get(Query.Of("audit", ("subject", user), ("from", Now.AddDays(-1))))).Items());
        Assert.Empty((await admin.Get(Query.Of("audit", ("subject", user), ("from", Now.AddDays(1))))).Items());
        Assert.Empty((await admin.Get(Query.Of("audit", ("subject", user), ("to", Now.AddDays(-1))))).Items());
    }

    private static async Task SeesRoleInList(Api admin, Guid role, string name, params string[] permissions)
    {
        var listed = (await admin.Get("roles")).Items().With("id", role);
        Assert.Equal(name, listed.Text("name"));
        Assert.Equal(permissions, listed.Items("permissions").Select(p => p.GetValue<string>()));
    }

    private static async Task SeesUserInList(Api admin, Guid user, string login, Guid role, params LocationId[] locations)
    {
        var listed = (await admin.Get("users")).Items().With("id", user);
        Assert.Equal(login, listed.Text("login"));
        Assert.Equal("Active", listed.Text("status"));
        Assert.Equal(new[] { role }, listed.Items("roles").Select(r => r.GetValue<Guid>()));
        Assert.Equal(locations.Select(l => l.Value), listed.Items("locations").Select(l => l.GetValue<Guid>()));
    }

    /// <summary>Any employee can name the users and locations on the documents they see, without admin rights.</summary>
    private static async Task NamesUsersAndLocations(Api employee, Guid user, string login, LocationId otherLocation)
    {
        Assert.Equal(login, (await employee.Get("users/logins")).Items().With("id", user).Text("login"));
        Assert.True((await employee.Get("locations")).Items().With("id", otherLocation.Value)["active"]!.GetValue<bool>());
        await employee.Refused(HttpStatusCode.Forbidden, HttpMethod.Get, "users");
    }
}
