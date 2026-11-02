namespace Shared;

/// <summary>Unique operation key; a repeated command with the same key must not be posted twice.</summary>
public readonly record struct IdempotencyKey
{
    public string Value { get; }

    public IdempotencyKey(string value)
    {
        var trimmed = Guard.NotBlank(value);
        Guard.That(trimmed.Length <= 128, "Idempotency key is too long.");
        Value = trimmed;
    }

    public override string ToString() => Value;
}
