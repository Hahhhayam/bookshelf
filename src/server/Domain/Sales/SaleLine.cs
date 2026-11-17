namespace Domain.Sales;

public sealed class SaleLine : Entity<Guid>
{
    public BookId BookId { get; }
    public Quantity Quantity { get; }
    public Money UnitPrice { get; }
    public Discount Discount { get; }

    // EF Core cannot bind complex-type properties through the constructor, so it materializes via this one.
    private SaleLine() : base(default) { }

    public SaleLine(BookId bookId, Quantity quantity, Money unitPrice, Discount discount) : base(Guid.CreateVersion7())
    {
        Guard.That(!quantity.IsZero, "quantity-not-positive", "Sale quantity must be positive.");
        Guard.That(!unitPrice.IsNegative && !discount.Amount.IsNegative, "price-negative", "Price and discount cannot be negative.");
        Guard.That(discount.Amount <= unitPrice * quantity, "discount-exceeds-line", "A discount cannot exceed the line amount.");
        BookId = bookId;
        Quantity = quantity;
        UnitPrice = unitPrice;
        Discount = discount;
    }

    public Money Total => UnitPrice * Quantity - Discount.Amount;
}
