namespace Shared;

public readonly record struct Quantity : IComparable<Quantity>
{
    public int Value { get; }

    public Quantity(int value)
    {
        Guard.That(value >= 0, "Quantity cannot be negative.");
        Value = value;
    }

    public static Quantity Zero => new(0);

    public bool IsZero => Value == 0;

    public static Quantity operator +(Quantity a, Quantity b) => new(a.Value + b.Value);
    public static Quantity operator -(Quantity a, Quantity b) => new(a.Value - b.Value);

    public int CompareTo(Quantity other) => Value.CompareTo(other.Value);

    public static bool operator <(Quantity a, Quantity b) => a.Value < b.Value;
    public static bool operator >(Quantity a, Quantity b) => a.Value > b.Value;
    public static bool operator <=(Quantity a, Quantity b) => a.Value <= b.Value;
    public static bool operator >=(Quantity a, Quantity b) => a.Value >= b.Value;

    public override string ToString() => Value.ToString();
}
