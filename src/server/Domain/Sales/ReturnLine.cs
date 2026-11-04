namespace Domain.Sales;

public sealed class ReturnLine : Entity<BookId>
{
    public Quantity Quantity { get; }
    public Money UnitRefund { get; }

    // EF Core cannot bind complex-type properties through the constructor, so it materializes via this one.
    private ReturnLine() : base(default) { }

    internal ReturnLine(BookId id, Quantity quantity, Money unitRefund) : base(id)
    {
        Quantity = quantity;
        UnitRefund = unitRefund;
    }

    public Money Refund => UnitRefund * Quantity;
}
