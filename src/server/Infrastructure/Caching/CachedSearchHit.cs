using Application.Catalog;

namespace Infrastructure.Caching;

internal sealed record CachedSearchHit(
    Guid Book, string Title, decimal Price, string Currency, CachedStockLevel[] Availability)
{
    public static CachedSearchHit From(BookSearchResult r) => new(
        r.Book.Value, r.Title, r.Price.Amount, r.Price.Currency.Value,
        r.Availability.Select(a => new CachedStockLevel(a.Location.Value, a.Available.Value)).ToArray());

    public BookSearchResult ToResult() => new(
        new BookId(Book), Title, new Money(Price, new CurrencyCode(Currency)),
        Availability.Select(a => new LocationAvailability(new LocationId(a.Location), new Quantity(a.Available))).ToList());
}
