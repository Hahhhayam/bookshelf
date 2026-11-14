namespace Domain.Catalog;

/// <summary>
/// One step of a book's price history, written from the book's events. Entries are never changed or deleted;
/// the entry takes the id of the event it records, so a redelivered event cannot add it twice.
/// </summary>
public sealed class PriceEntry : AggregateRoot<Guid>
{
    public BookId BookId { get; }
    public Money Price { get; }
    public DateTimeOffset ValidFrom { get; }
    public UserId SetBy { get; }

    // EF Core cannot bind complex-type properties through the constructor, so it materializes via this one.
    private PriceEntry() : base(default) { }

    private PriceEntry(Guid id, BookId bookId, Money price, DateTimeOffset validFrom, UserId setBy) : base(id)
    {
        BookId = bookId;
        Price = price;
        ValidFrom = validFrom;
        SetBy = setBy;
    }

    public static PriceEntry Record(Guid eventId, BookId bookId, Money price, DateTimeOffset validFrom, UserId setBy) =>
        new(eventId, bookId, price, validFrom, setBy);
}
