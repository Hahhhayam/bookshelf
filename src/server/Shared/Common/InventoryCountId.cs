namespace Shared;

public readonly record struct InventoryCountId(Guid Value)
{
    public static InventoryCountId New() => new(Guid.CreateVersion7());
    public override string ToString() => Value.ToString();
}
