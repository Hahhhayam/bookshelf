namespace Domain.Purchasing;

public sealed class ReceiptLine : Entity<BookId>
{
    public Quantity Ordered { get; }
    public Quantity Received { get; }

    internal ReceiptLine(BookId id, Quantity ordered, Quantity received) : base(id)
    {
        Ordered = ordered;
        Received = received;
    }
}
