namespace EndToEndTests.Samples;

/// <summary>The catalog part of a preseed, handed between the seeding steps.</summary>
internal sealed record SampleCatalog(
    BookId Kobzar, BookId Dune, BookId Notebook, CategoryId Fiction, CategoryId Stationery, SupplierId Supplier,
    IReadOnlyDictionary<BookId, string> Titles);
