namespace Domain.Inventory;

public sealed class WriteOffLine : Entity<BookId>
{
    public Quantity Quantity { get; }

    internal WriteOffLine(BookId id, Quantity quantity) : base(id) => Quantity = quantity;
}
