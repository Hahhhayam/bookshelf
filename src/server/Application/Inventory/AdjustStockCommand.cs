namespace Application.Inventory;

public sealed record AdjustStockCommand(LocationId Location, BookId Book, Quantity NewOnHand, AdjustmentReason Reason);
