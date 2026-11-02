namespace Application.Reporting;

public sealed record ManagementReport(
    Money Revenue, Money Margin, Money AverageCheck, IReadOnlyList<BookSalesFigure> TopBooks,
    IReadOnlyList<BookId> SlowMovingBooks);
