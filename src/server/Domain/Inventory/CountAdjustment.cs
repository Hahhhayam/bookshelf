namespace Domain.Inventory;

public readonly record struct CountAdjustment(BookId BookId, Quantity NewOnHand);
