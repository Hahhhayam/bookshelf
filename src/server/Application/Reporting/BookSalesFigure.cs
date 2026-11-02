namespace Application.Reporting;

public sealed record BookSalesFigure(BookId Book, Quantity Sold, Money Revenue);
