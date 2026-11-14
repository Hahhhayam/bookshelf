namespace Application.Reporting;

public sealed record StoreFigure(LocationId Location, Money Revenue, Money Margin, int Receipts, Money AverageCheck);
