namespace Domain.Administration;

/// <summary>The password stored as a strong hash; the plain password never reaches the domain.</summary>
public readonly record struct PasswordHash
{
    public string Value { get; }

    public PasswordHash(string value) => Value = Guard.NotBlank(value);
}
