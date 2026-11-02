namespace Shared;

public readonly record struct PromotionId(Guid Value)
{
    public static PromotionId New() => new(Guid.CreateVersion7());
    public override string ToString() => Value.ToString();
}
