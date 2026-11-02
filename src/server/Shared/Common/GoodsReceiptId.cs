namespace Shared;

public readonly record struct GoodsReceiptId(Guid Value)
{
    public static GoodsReceiptId New() => new(Guid.CreateVersion7());
    public override string ToString() => Value.ToString();
}
