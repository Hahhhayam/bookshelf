namespace Domain.Sales;

/// <summary>A manual discount or one produced by a promotion, as an amount off a line.</summary>
public readonly record struct Discount(Money Amount, DiscountSource Source)
{
    // EF Core cannot bind the nested Money through the primary constructor, so it materializes via this one.
    public Discount() : this(default, DiscountSource.None)
    {
    }

    public static Discount None(string currency) => new(Money.Zero(currency), DiscountSource.None);
}
