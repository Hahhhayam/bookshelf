namespace Domain.Inventory;

public sealed class CountLine : Entity<BookId>
{
    public Quantity Expected { get; }
    public Quantity? Counted { get; internal set; }

    internal CountLine(BookId bookId, Quantity expected) : base(bookId) => Expected = expected;
}
