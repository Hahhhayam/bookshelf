namespace EndToEndTests.Samples;

/// <summary>
/// What a preseed created, for the steps to refer to. Prices are in UAH: Kobzar 300, Dune 450 with a 10% promotion,
/// Notebook 50. Store A holds Kobzar 10, Dune 5, Notebook 20; the warehouse holds Kobzar 50, Dune 30; Store B is empty.
/// </summary>
public sealed record SampleWorld(
    LocationId StoreA, LocationId StoreB, LocationId Warehouse,
    BookId Kobzar, BookId Dune, BookId Notebook, CategoryId Fiction, CategoryId Stationery,
    SupplierId Supplier, CustomerId Customer, string CustomerCard,
    IReadOnlyDictionary<BookId, string> Titles, IReadOnlyDictionary<string, UserId> Users);
