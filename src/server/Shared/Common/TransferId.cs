namespace Shared;

public readonly record struct TransferId(Guid Value)
{
    public static TransferId New() => new(Guid.CreateVersion7());
    public override string ToString() => Value.ToString();
}
