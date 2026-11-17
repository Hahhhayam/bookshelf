namespace Application.Reporting;

/// <param name="DaysOfStock">How many days the stock on hand lasts at the period's sales rate; null with no sales.</param>
/// <param name="SlowMovingBooks">In stock but not sold in the period (surplus).</param>
/// <param name="Shortages">Current stock below its minimum, regardless of the period.</param>
/// <param name="PreviousPeriod">The same figures for the period of equal length right before this one.</param>
public sealed record ManagementReport(
    Money Revenue, Money Margin, int Receipts, Money AverageCheck, PeriodTotals PreviousPeriod, decimal? DaysOfStock,
    IReadOnlyList<BookSalesFigure> TopBooks, IReadOnlyList<BookId> SlowMovingBooks,
    IReadOnlyList<StockShortage> Shortages, IReadOnlyList<AbcEntry> Abc,
    IReadOnlyList<StoreFigure> Stores, IReadOnlyList<CategoryFigure> Categories);
