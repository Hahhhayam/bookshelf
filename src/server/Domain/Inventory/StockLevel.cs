namespace Domain.Inventory;

/// <summary>On-hand and reserved quantities; available equals on hand minus reserved.</summary>
public readonly record struct StockLevel(Quantity OnHand, Quantity Reserved)
{
    public Quantity Available => OnHand - Reserved;
}
