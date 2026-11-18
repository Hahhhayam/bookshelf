using Application.Administration;
using Application.Catalog;
using Infrastructure.Persistence;
using Microsoft.Extensions.DependencyInjection;

namespace EndToEndTests.Samples;

/// <summary>
/// Preseeds written through the domain and the real DbContext, so seeding raises and handles the same events as
/// the app (for example, every book gets its first price history entry).
/// </summary>
public static class Sample
{
    public static async Task<SampleWorld> Standard(IServiceProvider services)
    {
        var db = services.GetRequiredService<BookstoreDbContext>();
        var now = services.GetRequiredService<IClock>().Now;
        var hasher = services.GetRequiredService<IPasswordHasher>();

        var (storeA, storeB, warehouse) = Locations(db);
        var users = Users(db, hasher, storeA, storeB, warehouse);
        var catalog = Catalog(db, users[SampleUsers.Commercial], now);
        Stock(db, now, storeA, warehouse, catalog);
        var customer = Customer(db);
        db.Add(Promotion.Create("Dune week", new Period(now.AddDays(-1), now.AddDays(30)),
            new PromotionCondition(catalog.Dune, null, new Quantity(1)), 10m, 1));
        await db.SaveChangesAsync();

        return new SampleWorld(storeA, storeB, warehouse, catalog.Kobzar, catalog.Dune, catalog.Notebook,
            catalog.Fiction, catalog.Stationery, catalog.Supplier, customer, CustomerCardNumber, catalog.Titles, users);
    }

    private const string CustomerCardNumber = "CARD-0001";

    private static (LocationId StoreA, LocationId StoreB, LocationId Warehouse) Locations(BookstoreDbContext db)
    {
        var storeA = Location.Create("Store A", LocationType.Store, new Address("Kyiv, Khreshchatyk 1"));
        var storeB = Location.Create("Store B", LocationType.Store, new Address("Lviv, Rynok 2"));
        var warehouse = Location.Create("Central warehouse", LocationType.CentralWarehouse, new Address("Brovary 3"));
        db.AddRange(storeA, storeB, warehouse);
        return (storeA.Id, storeB.Id, warehouse.Id);
    }

    private static Dictionary<string, UserId> Users(
        BookstoreDbContext db, IPasswordHasher hasher, LocationId storeA, LocationId storeB, LocationId warehouse)
    {
        LocationId[] everywhere = [storeA, storeB, warehouse];
        var users = new Dictionary<string, UserId>();
        void Add(string login, LocationId[] access, params string[] permissions) =>
            users[login] = AddUser(db, hasher, login, new LocationAccess(access.ToHashSet()), permissions);

        Add(SampleUsers.Cashier, [storeA], Permissions.SalesCreate, Permissions.ReturnsCreate);
        Add(SampleUsers.StoreAdmin, [storeA], Permissions.OrdersManage, Permissions.SalesCreate,
            Permissions.ReturnsCreate, Permissions.ReturnsConfirm, Permissions.StockAdjust, Permissions.TransfersManage,
            Permissions.ReportsView, Permissions.AuditView, Permissions.ShiftsManage);
        Add(SampleUsers.StoreAdminB, [storeB], Permissions.OrdersManage, Permissions.TransfersManage,
            Permissions.StockAdjust, Permissions.ReportsView);
        Add(SampleUsers.Keeper, [warehouse], Permissions.TransfersManage, Permissions.ReceivingConfirm,
            Permissions.StockAdjust);
        Add(SampleUsers.Purchasing, [warehouse], Permissions.PurchasingManage);
        Add(SampleUsers.Commercial, [], Permissions.PriceChange, Permissions.CatalogEdit, Permissions.AuditView);
        Add(SampleUsers.ChainManager, everywhere, Permissions.ReportsView, Permissions.ReportsChainWide);
        Add(SampleUsers.NoGeoManager, [], Permissions.ReportsView, Permissions.ReportsChainWide);
        users[SampleUsers.Everywhere] = AddUser(db, hasher, SampleUsers.Everywhere, LocationAccess.All, [Permissions.SalesCreate]);
        Add(SampleUsers.Admin, everywhere, Permissions.UsersManage, Permissions.AuditView, Permissions.LocationsManage,
            Permissions.IntegrationsManage);
        return users;
    }

    private static UserId AddUser(
        BookstoreDbContext db, IPasswordHasher hasher, string login, LocationAccess access, string[] permissions)
    {
        var role = Role.Create($"{login} role", permissions.Select(code => new Permission(code)));
        var user = User.Create(login, hasher.Hash(SampleUsers.Password), access, [role.Id]);
        db.AddRange(role, user);
        return user.Id;
    }

    private static SampleCatalog Catalog(BookstoreDbContext db, UserId createdBy, DateTimeOffset now)
    {
        var fiction = Category.Create("Fiction");
        var stationery = Category.Create("Stationery");
        var author = Author.Create("Taras Shevchenko");
        var publisher = Publisher.Create("A-BA-BA-HA-LA-MA-HA");
        var supplier = Supplier.Create("Book Distribution", "orders@distribution.example");
        db.AddRange(fiction, stationery, author, publisher, supplier);

        Book NewBook(string title, ItemType type, CategoryId category, string? isbn, decimal price) =>
            Book.Create(title, type, new Barcode($"BC-{title}"), category, [author.Id], publisher.Id,
                isbn is null ? null : new Isbn(isbn), new Money(price, CurrencyCode.Uah), now, createdBy,
                new KnownIsbnRegistry(false));

        var kobzar = NewBook("Kobzar", ItemType.Book, fiction.Id, "9780306406157", 300m);
        var dune = NewBook("Dune", ItemType.Book, fiction.Id, "9780441013593", 450m);
        var notebook = NewBook("Notebook", ItemType.Other, stationery.Id, null, 50m);
        db.AddRange(kobzar, dune, notebook);
        return new SampleCatalog(kobzar.Id, dune.Id, notebook.Id, fiction.Id, stationery.Id, supplier.Id,
            new Dictionary<BookId, string> { [kobzar.Id] = kobzar.Title, [dune.Id] = dune.Title, [notebook.Id] = notebook.Title });
    }

    private static void Stock(BookstoreDbContext db, DateTimeOffset now, LocationId storeA, LocationId warehouse,
        SampleCatalog catalog)
    {
        void Put(LocationId location, BookId book, int quantity, int minimum = 0)
        {
            var item = StockItem.Open(location, book, new Quantity(minimum));
            item.ReceiveGoods(new Quantity(quantity), Guid.CreateVersion7(), now);
            db.Add(item);
        }

        Put(storeA, catalog.Kobzar, 10);
        Put(storeA, catalog.Dune, 5);
        Put(storeA, catalog.Notebook, 20, minimum: 2);
        Put(warehouse, catalog.Kobzar, 50);
        Put(warehouse, catalog.Dune, 30);
    }

    private static CustomerId Customer(BookstoreDbContext db)
    {
        var customer = Domain.Crm.Customer.Register(
            new ContactInfo("Olena Kovalenko", "+380501112233", null), new CustomerCard(CustomerCardNumber));
        db.AddRange(customer, BonusAccount.Open(customer.Id));
        return customer.Id;
    }
}
