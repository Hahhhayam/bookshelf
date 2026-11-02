namespace Domain.Purchasing;

/// <summary>A difference between the ordered and the received quantity.</summary>
public sealed class Discrepancy : Entity<Guid>
{
    public BookId BookId { get; }
    public Quantity Ordered { get; }
    public Quantity Received { get; }

    internal Discrepancy(BookId bookId, Quantity ordered, Quantity received) : base(Guid.CreateVersion7())
    {
        BookId = bookId;
        Ordered = ordered;
        Received = received;
    }
}
