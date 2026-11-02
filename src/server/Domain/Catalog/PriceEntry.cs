namespace Domain.Catalog;

/// <summary>A base price valid from a given moment. Entries are never deleted: they form the price history.</summary>
public sealed class PriceEntry : Entity<Guid>
{
    public Money Price { get; }
    public DateTimeOffset ValidFrom { get; }
    public UserId SetBy { get; }

    internal PriceEntry(Money price, DateTimeOffset validFrom, UserId setBy) : base(Guid.CreateVersion7())
    {
        Guard.That(!price.IsNegative, "Price cannot be negative.");
        Price = price;
        ValidFrom = validFrom;
        SetBy = setBy;
    }
}
