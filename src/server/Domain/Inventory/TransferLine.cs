namespace Domain.Inventory;

public sealed class TransferLine : Entity<BookId>
{
    public Quantity Shipped { get; }
    public Quantity? Received { get; internal set; }

    internal TransferLine(BookId id, Quantity shipped) : base(id) => Shipped = shipped;
}
