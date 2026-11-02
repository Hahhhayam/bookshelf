namespace Domain.Orders;

public readonly record struct PickupCode
{
    public string Value { get; }

    public PickupCode(string value) => Value = Guard.NotBlank(value);

    public override string ToString() => Value;
}
