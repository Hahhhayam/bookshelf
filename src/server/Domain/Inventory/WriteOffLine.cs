namespace Domain.Inventory;

public sealed class WriteOffLine : Entity<BookId>
{
    public Quantity Quantity { get; }

    internal WriteOffLine(BookId bookId, Quantity quantity) : base(bookId) => Quantity = quantity;
}
