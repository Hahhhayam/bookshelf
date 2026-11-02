namespace Shared;

public readonly record struct CartId(Guid Value)
{
    public static CartId New() => new(Guid.CreateVersion7());
    public override string ToString() => Value.ToString();
}
