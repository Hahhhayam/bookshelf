namespace Domain.Orders;

public sealed class CartLine : Entity<BookId>
{
    public Quantity Quantity { get; internal set; }

    internal CartLine(BookId bookId, Quantity quantity) : base(bookId) => Quantity = quantity;
}
