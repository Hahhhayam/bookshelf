namespace Shared;

public readonly record struct StockItemId(Guid Value)
{
    public static StockItemId New() => new(Guid.CreateVersion7());
    public override string ToString() => Value.ToString();
}
