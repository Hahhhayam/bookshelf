namespace Domain.Purchasing;

public sealed class PurchaseOrderLine : Entity<BookId>
{
    public Quantity Ordered { get; }
    public Quantity Received { get; internal set; } = Quantity.Zero;
    public Money PurchasePrice { get; }

    // EF Core cannot bind complex-type properties through the constructor, so it materializes via this one.
    private PurchaseOrderLine() : base(default) { }

    internal PurchaseOrderLine(BookId id, Quantity ordered, Money purchasePrice) : base(id)
    {
        Ordered = ordered;
        PurchasePrice = purchasePrice;
    }
}
