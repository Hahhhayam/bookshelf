namespace Domain.Inventory;

/// <summary>Raised when the received quantity differs from the shipped one, so someone can review it.</summary>
public sealed class Discrepancy : Entity<Guid>
{
    public BookId BookId { get; }
    public Quantity Expected { get; }
    public Quantity Actual { get; }
    public bool IsResolved { get; private set; }

    internal Discrepancy(BookId bookId, Quantity expected, Quantity actual) : base(Guid.CreateVersion7())
    {
        BookId = bookId;
        Expected = expected;
        Actual = actual;
    }

    public void Resolve() => IsResolved = true;
}
