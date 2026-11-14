namespace Application.Reporting;

public sealed record StockFact(LocationId Location, BookId Book, Quantity OnHand, Quantity Minimum);
