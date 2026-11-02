namespace Application.Catalog;

public sealed record BookSearchResult(
    BookId Book, string Title, Money Price, IReadOnlyList<LocationAvailability> Availability);
