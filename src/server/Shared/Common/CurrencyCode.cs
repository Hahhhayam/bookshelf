namespace Shared;

/// <summary>Three-letter ISO 4217 code, stored in upper case.</summary>
public readonly record struct CurrencyCode
{
    public static CurrencyCode Uah { get; } = new("UAH");

    public string Value { get; }

    public CurrencyCode(string value)
    {
        var code = Guard.NotBlank(value).Trim().ToUpperInvariant();
        Guard.That(code.Length == 3 && code.All(char.IsAsciiLetter), "Currency must be a three-letter ISO code.");
        Value = code;
    }

    public override string ToString() => Value;
}
