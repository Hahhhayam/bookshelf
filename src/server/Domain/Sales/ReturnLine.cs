namespace Domain.Sales;

public sealed class ReturnLine : Entity<BookId>
{
    public Quantity Quantity { get; }
    public Money UnitRefund { get; }

    internal ReturnLine(BookId bookId, Quantity quantity, Money unitRefund) : base(bookId)
    {
        Quantity = quantity;
        UnitRefund = unitRefund;
    }

    public Money Refund => UnitRefund * Quantity;
}
