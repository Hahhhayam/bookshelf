namespace Domain.Inventory;

public sealed class TransferLine : Entity<BookId>
{
    public Quantity Shipped { get; }
    public Quantity? Received { get; internal set; }

    internal TransferLine(BookId bookId, Quantity shipped) : base(bookId) => Shipped = shipped;
}
