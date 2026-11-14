namespace Domain.Administration;

/// <summary>A permission code such as "sales.cancel" or "returns.confirm".</summary>
public readonly record struct Permission
{
    public string Code { get; }

    public Permission(string code) => Code = Guard.NotBlank(code);

    public static implicit operator Permission(string code) => new(code);

    public override string ToString() => Code;
}
