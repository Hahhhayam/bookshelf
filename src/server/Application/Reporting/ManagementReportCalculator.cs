namespace Application.Reporting;

/// <summary>Turns the loaded sales and stock facts into the management report's figures (FR-16).</summary>
public static class ManagementReportCalculator
{
    private const int TopBookCount = 10;

    // Classic ABC split: the books bringing the first 80% of revenue are A, the next 15% B, the rest C.
    private const decimal AShare = 0.80m;
    private const decimal BShare = 0.95m;

    public static ManagementReport Calculate(ReportData data, Period period)
    {
        var lines = data.Lines;
        var revenue = Sum(lines, data.Currency);
        var receipts = lines.Select(l => l.Sale).Distinct().Count();
        return new ManagementReport(
            revenue, revenue - Cost(lines, data), receipts, AverageCheck(revenue, receipts),
            DaysOfStock(data, period), TopBooks(data), SlowMovingBooks(data), Shortages(data), Abc(data),
            Stores(data), Categories(data));
    }

    private static Money Sum(IEnumerable<SoldLineFact> lines, CurrencyCode currency) =>
        Money.Sum(lines.Select(l => l.Revenue), currency);

    private static Money Cost(IEnumerable<SoldLineFact> lines, ReportData data) =>
        Money.Sum(lines.Select(l => new Money(data.AveragePurchasePrice.GetValueOrDefault(l.Book), data.Currency)
            * l.Quantity), data.Currency);

    private static Money AverageCheck(Money revenue, int receipts) =>
        receipts == 0 ? Money.Zero(revenue.Currency) : revenue * (1m / receipts);

    private static decimal? DaysOfStock(ReportData data, Period period)
    {
        var sold = data.Lines.Sum(l => l.Quantity.Value);
        if (sold == 0)
            return null;
        var days = Math.Max(1m, (decimal)(period.End - period.Start).TotalDays);
        var onHand = data.Stock.Sum(s => s.OnHand.Value);
        return Math.Round(onHand / (sold / days), 1);
    }

    private static List<BookSalesFigure> TopBooks(ReportData data) =>
        data.Lines.GroupBy(l => l.Book)
            .Select(g => new BookSalesFigure(g.Key, new Quantity(g.Sum(l => l.Quantity.Value)), Sum(g, data.Currency)))
            .OrderByDescending(f => f.Sold.Value)
            .ThenByDescending(f => f.Revenue.Amount)
            .Take(TopBookCount)
            .ToList();

    private static List<BookId> SlowMovingBooks(ReportData data)
    {
        var sold = data.Lines.Select(l => l.Book).ToHashSet();
        return data.Stock.Where(s => !s.OnHand.IsZero && !sold.Contains(s.Book)).Select(s => s.Book).Distinct().ToList();
    }

    private static List<StockShortage> Shortages(ReportData data) =>
        data.Stock.Where(s => s.OnHand < s.Minimum)
            .Select(s => new StockShortage(s.Location, s.Book, s.OnHand, s.Minimum))
            .ToList();

    private static List<AbcEntry> Abc(ReportData data)
    {
        var byBook = data.Lines.GroupBy(l => l.Book)
            .Select(g => (Book: g.Key, Revenue: Sum(g, data.Currency)))
            .OrderByDescending(b => b.Revenue.Amount)
            .ToList();
        var total = byBook.Sum(b => b.Revenue.Amount);
        var entries = new List<AbcEntry>();
        var before = 0m;
        foreach (var (book, revenue) in byBook)
        {
            var share = total == 0m ? 1m : before + revenue.Amount / total;
            entries.Add(new AbcEntry(book, revenue, Math.Round(share, 4), ClassFor(before)));
            before = share;
        }
        return entries;
    }

    /// <summary>A book is classed by the share above it, so the one that crosses a threshold stays in the upper class.</summary>
    private static AbcClass ClassFor(decimal shareBefore) =>
        shareBefore < AShare ? AbcClass.A : shareBefore < BShare ? AbcClass.B : AbcClass.C;

    private static List<StoreFigure> Stores(ReportData data) =>
        data.Lines.GroupBy(l => l.Location)
            .Select(g =>
            {
                var revenue = Sum(g, data.Currency);
                var receipts = g.Select(l => l.Sale).Distinct().Count();
                return new StoreFigure(g.Key, revenue, revenue - Cost(g, data), receipts, AverageCheck(revenue, receipts));
            })
            .OrderByDescending(s => s.Revenue.Amount)
            .ToList();

    private static List<CategoryFigure> Categories(ReportData data) =>
        data.Lines.GroupBy(l => l.Category)
            .Select(g => new CategoryFigure(g.Key, new Quantity(g.Sum(l => l.Quantity.Value)), Sum(g, data.Currency)))
            .OrderByDescending(c => c.Revenue.Amount)
            .ToList();
}
