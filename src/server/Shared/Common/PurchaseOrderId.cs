namespace Shared;

public readonly record struct PurchaseOrderId(Guid Value)
{
    public static PurchaseOrderId New() => new(Guid.CreateVersion7());
    public override string ToString() => Value.ToString();
}
