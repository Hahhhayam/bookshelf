namespace Domain.Purchasing;

public sealed class ReceiptLine : Entity<BookId>
{
    public Quantity Ordered { get; }
    public Quantity Received { get; }

    internal ReceiptLine(BookId bookId, Quantity ordered, Quantity received) : base(bookId)
    {
        Ordered = ordered;
        Received = received;
    }
}
