namespace Domain.Catalog;

public readonly record struct Barcode
{
    public string Value { get; }

    public Barcode(string value) => Value = Guard.NotBlank(value);

    public override string ToString() => Value;
}
