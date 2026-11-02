namespace Domain.Sales;

/// <summary>A manual discount or one produced by a promotion, as an amount off a line.</summary>
public readonly record struct Discount(Money Amount, DiscountSource Source)
{
    public static Discount None(string currency) => new(Money.Zero(currency), DiscountSource.None);
}
