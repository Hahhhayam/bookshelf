namespace Domain.Purchasing;

public sealed class PurchaseOrderLine : Entity<BookId>
{
    public Quantity Ordered { get; }
    public Quantity Received { get; internal set; } = Quantity.Zero;
    public Money PurchasePrice { get; }

    internal PurchaseOrderLine(BookId bookId, Quantity ordered, Money purchasePrice) : base(bookId)
    {
        Ordered = ordered;
        PurchasePrice = purchasePrice;
    }
}
