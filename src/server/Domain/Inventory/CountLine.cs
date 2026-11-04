namespace Domain.Inventory;

public sealed class CountLine : Entity<BookId>
{
    public Quantity Expected { get; }
    public Quantity? Counted { get; internal set; }

    internal CountLine(BookId id, Quantity expected) : base(id) => Expected = expected;
}
