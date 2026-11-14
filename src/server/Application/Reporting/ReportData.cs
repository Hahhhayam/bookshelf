namespace Application.Reporting;

/// <param name="AveragePurchasePrice">Per book, in <paramref name="Currency"/>; a book never purchased costs nothing.</param>
public sealed record ReportData(
    IReadOnlyList<SoldLineFact> Lines, IReadOnlyList<StockFact> Stock,
    IReadOnlyDictionary<BookId, decimal> AveragePurchasePrice, CurrencyCode Currency);
