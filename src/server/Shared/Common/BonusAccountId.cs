namespace Shared;

public readonly record struct BonusAccountId(Guid Value)
{
    public static BonusAccountId New() => new(Guid.CreateVersion7());
    public override string ToString() => Value.ToString();
}
