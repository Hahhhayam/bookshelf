namespace Domain.Orders;

public sealed class CartLine : Entity<BookId>
{
    public Quantity Quantity { get; internal set; }

    internal CartLine(BookId id, Quantity quantity) : base(id) => Quantity = quantity;
}
