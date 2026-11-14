namespace Application.Reporting;

public sealed record StockShortage(LocationId Location, BookId Book, Quantity OnHand, Quantity Minimum);
