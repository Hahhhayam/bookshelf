namespace Domain.Orders;

public sealed class OrderLine : Entity<BookId>
{
    public Quantity Quantity { get; }
    public Money UnitPrice { get; }

    internal OrderLine(BookId bookId, Quantity quantity, Money unitPrice) : base(bookId)
    {
        Quantity = quantity;
        UnitPrice = unitPrice;
    }

    public Money Total => UnitPrice * Quantity;
}
