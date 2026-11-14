namespace Domain.Catalog;

public readonly record struct ItemQuantity(BookId BookId, Quantity Quantity);
