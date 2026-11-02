namespace Domain.Catalog;

/// <summary>Validated ISBN-10 or ISBN-13, stored without separators.</summary>
public readonly record struct Isbn
{
    public string Value { get; }

    public Isbn(string value)
    {
        var digits = Guard.NotBlank(value).Replace("-", "").Replace(" ", "").ToUpperInvariant();
        Guard.That(digits.Length switch
        {
            13 => IsValidIsbn13(digits),
            10 => IsValidIsbn10(digits),
            _ => false,
        }, $"'{value}' is not a valid ISBN.");
        Value = digits;
    }

    private static bool IsValidIsbn13(string s) =>
        s.All(char.IsDigit) && s.Select((c, i) => (c - '0') * (i % 2 == 0 ? 1 : 3)).Sum() % 10 == 0;

    private static bool IsValidIsbn10(string s) =>
        s[..9].All(char.IsDigit) && (char.IsDigit(s[9]) || s[9] == 'X') &&
        s.Select((c, i) => (c == 'X' ? 10 : c - '0') * (10 - i)).Sum() % 11 == 0;

    public override string ToString() => Value;
}
