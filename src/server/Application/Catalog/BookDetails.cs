namespace Application.Catalog;

/// <summary>Read model of one catalog item. Excludes availability, which changes with every sale and is never cached.</summary>
public sealed record BookDetails(
    BookId Book, string Title, Money Price, Isbn? Isbn, Barcode Barcode, ItemType ItemType, Domain.Catalog.SaleStatus Status,
    PublisherId? Publisher, CategoryId Category, IReadOnlyList<AuthorId> Authors);
