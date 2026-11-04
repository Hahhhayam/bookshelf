namespace Domain.Orders;

public sealed class OrderLine : Entity<BookId>
{
    public Quantity Quantity { get; }
    public Money UnitPrice { get; }

    // EF Core cannot bind complex-type properties through the constructor, so it materializes via this one.
    private OrderLine() : base(default) { }

    internal OrderLine(BookId id, Quantity quantity, Money unitPrice) : base(id)
    {
        Quantity = quantity;
        UnitPrice = unitPrice;
    }

    public Money Total => UnitPrice * Quantity;
}
