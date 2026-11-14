using Application.Catalog;

namespace Infrastructure.Caching;

/// <summary>Primitive-only form of <see cref="BookDetails"/>, so the cached JSON does not depend on value object constructors.</summary>
internal sealed record CachedBook(
    Guid Book, string Title, decimal Price, string Currency, string? Isbn, string Barcode, ItemType ItemType,
    Domain.Catalog.SaleStatus Status, Guid? Publisher, Guid Category, Guid[] Authors)
{
    public static CachedBook From(BookDetails d) => new(
        d.Book.Value, d.Title, d.Price.Amount, d.Price.Currency.Value, d.Isbn?.Value, d.Barcode.Value, d.ItemType,
        d.Status, d.Publisher?.Value, d.Category.Value, d.Authors.Select(a => a.Value).ToArray());

    public BookDetails ToDetails() => new(
        new BookId(Book), Title, new Money(Price, new CurrencyCode(Currency)), Isbn is null ? null : new Isbn(Isbn),
        new Barcode(Barcode), ItemType, Status, Publisher is { } p ? new PublisherId(p) : null, new CategoryId(Category),
        Authors.Select(a => new AuthorId(a)).ToList());
}
