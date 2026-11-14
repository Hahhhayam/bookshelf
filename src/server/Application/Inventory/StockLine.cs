namespace Application.Inventory;

/// <summary>FR-09: actual, reserved and available stock of one item at one location.</summary>
public sealed record StockLine(
    BookId Book, Quantity OnHand, Quantity Reserved, Quantity Available, Quantity Minimum, bool BelowMinimum);
