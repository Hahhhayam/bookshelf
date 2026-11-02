namespace Shared;

/// <summary>An amount with its currency. Rounded to two decimals; arithmetic requires matching currencies.</summary>
public readonly record struct Money : IComparable<Money>
{
    public decimal Amount { get; }
    public string Currency { get; }

    public Money(decimal amount, string currency)
    {
        Guard.That(currency is { Length: > 0 } && currency.Trim().Length == 3,
            "Currency must be a three-letter ISO code.");
        Amount = decimal.Round(amount, 2, MidpointRounding.AwayFromZero);
        Currency = currency.Trim().ToUpperInvariant();
    }

    public static Money Zero(string currency) => new(0m, currency);

    public bool IsZero => Amount == 0m;
    public bool IsNegative => Amount < 0m;

    public static Money Sum(IEnumerable<Money> values, string currency) =>
        values.Aggregate(Zero(currency), (acc, m) => acc + m);

    public static Money operator +(Money a, Money b)
    {
        EnsureSameCurrency(a, b);
        return new(a.Amount + b.Amount, a.Currency);
    }

    public static Money operator -(Money a, Money b)
    {
        EnsureSameCurrency(a, b);
        return new(a.Amount - b.Amount, a.Currency);
    }

    public static Money operator *(Money m, decimal factor) => new(m.Amount * factor, m.Currency);

    public static Money operator *(Money m, Quantity q) => new(m.Amount * q.Value, m.Currency);

    public int CompareTo(Money other)
    {
        EnsureSameCurrency(this, other);
        return Amount.CompareTo(other.Amount);
    }

    public static bool operator <(Money a, Money b) => a.CompareTo(b) < 0;
    public static bool operator >(Money a, Money b) => a.CompareTo(b) > 0;
    public static bool operator <=(Money a, Money b) => a.CompareTo(b) <= 0;
    public static bool operator >=(Money a, Money b) => a.CompareTo(b) >= 0;

    public override string ToString() => $"{Amount:0.00} {Currency}";

    private static void EnsureSameCurrency(Money a, Money b) =>
        Guard.That(a.Currency == b.Currency, $"Currency mismatch: {a.Currency} and {b.Currency}.");
}
