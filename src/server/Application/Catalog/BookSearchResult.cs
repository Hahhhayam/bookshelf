namespace Application.Catalog;

public sealed record BookSearchResult(
    BookId Book, string Title, Money Price, IReadOnlyList<LocationAvailability> Availability, Barcode Barcode,
    Domain.Catalog.SaleStatus Status);
