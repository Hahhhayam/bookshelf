using Application.Reporting;
using Domain.Inventory;
using Domain.Purchasing;
using Domain.Sales;

namespace Infrastructure.Persistence.Queries.Reporting;

/// <summary>
/// Builds the report straight from the sales and stock tables. Quantities are value objects the database cannot sum,
/// so only narrow projections are loaded and aggregated here.
/// </summary>
internal sealed class ReportQueries(BookstoreDbContext db, ReportingOptions options) : IReportQueries
{
    private const int TopBookCount = 10;

    public async Task<ManagementReport> BuildManagementReportAsync(ReportRequest request, CancellationToken ct)
    {
        var totals = await SaleTotalsAsync(request, ct);
        var lines = await SoldLinesAsync(request, ct);
        var currency = totals.Count > 0 ? totals[0].Currency : new CurrencyCode(options.FallbackCurrency);

        var revenue = Money.Sum(totals, currency);
        var cost = await PurchaseCostAsync(lines, currency, ct);
        return new ManagementReport(
            revenue,
            revenue - cost,
            totals.Count == 0 ? Money.Zero(currency) : revenue * (1m / totals.Count),
            TopBooks(lines, currency),
            await SlowMovingBooksAsync(request, lines, ct));
    }

    private IQueryable<Sale> CompletedSales(ReportRequest request)
    {
        var sales = db.Set<Sale>().AsNoTracking()
            .Where(s => s.Status == SaleStatus.Completed)
            .Where(s => s.CompletedAt >= request.Period.Start && s.CompletedAt < request.Period.End);
        return request.Locations.Count == 0 ? sales : sales.Where(s => request.Locations.Contains(s.LocationId));
    }

    private Task<List<Money>> SaleTotalsAsync(ReportRequest request, CancellationToken ct) =>
        CompletedSales(request).Select(s => s.Total).ToListAsync(ct);

    private async Task<List<SoldLine>> SoldLinesAsync(ReportRequest request, CancellationToken ct)
    {
        var rows = await CompletedSales(request)
            .SelectMany(s => s.Lines)
            .Select(l => new
            {
                Book = l.BookId,
                l.Quantity,
                Unit = l.UnitPrice,
                Discount = l.Discount.Amount,
            })
            .ToListAsync(ct);

        return rows.Select(r => new SoldLine(r.Book, r.Quantity, r.Unit * r.Quantity - r.Discount)).ToList();
    }

    private async Task<Money> PurchaseCostAsync(IReadOnlyList<SoldLine> lines, CurrencyCode currency, CancellationToken ct)
    {
        var books = lines.Select(l => l.Book).Distinct().ToList();
        var prices = await db.Set<PurchaseOrder>().AsNoTracking()
            .Where(o => o.Status != PurchaseOrderStatus.Cancelled)
            .SelectMany(o => o.Lines)
            .Where(l => books.Contains(l.Id))
            .Select(l => new { Book = l.Id, l.PurchasePrice.Amount })
            .ToListAsync(ct);

        var average = prices.GroupBy(p => p.Book).ToDictionary(g => g.Key, g => g.Average(p => p.Amount));
        return Money.Sum(
            lines.Select(l => new Money(average.GetValueOrDefault(l.Book), currency) * l.Quantity), currency);
    }

    private static List<BookSalesFigure> TopBooks(IReadOnlyList<SoldLine> lines, CurrencyCode currency) =>
        lines
            .GroupBy(l => l.Book)
            .Select(g => new BookSalesFigure(
                g.Key, new Quantity(g.Sum(l => l.Quantity.Value)), Money.Sum(g.Select(l => l.Revenue), currency)))
            .OrderByDescending(f => f.Sold.Value)
            .ThenByDescending(f => f.Revenue.Amount)
            .Take(TopBookCount)
            .ToList();

    private async Task<List<BookId>> SlowMovingBooksAsync(
        ReportRequest request, IReadOnlyList<SoldLine> lines, CancellationToken ct)
    {
        var stock = db.Set<StockItem>().AsNoTracking();
        if (request.Locations.Count > 0)
            stock = stock.Where(s => request.Locations.Contains(s.LocationId));

        var sold = lines.Select(l => l.Book).ToHashSet();
        var stocked = await stock.Select(s => new { s.BookId, s.OnHand }).ToListAsync(ct);
        return stocked
            .Where(s => !s.OnHand.IsZero && !sold.Contains(s.BookId))
            .Select(s => s.BookId)
            .Distinct()
            .ToList();
    }
}
