namespace Domain.Administration;

public readonly record struct Address
{
    public string Value { get; }

    public Address(string value) => Value = Guard.NotBlank(value);
}
