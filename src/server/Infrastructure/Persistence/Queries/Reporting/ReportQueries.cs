using Application.Reporting;

namespace Infrastructure.Persistence.Queries.Reporting;

/// <summary>
/// Loads the report's facts straight from the sales, stock and purchase tables. Quantities and money are value
/// objects the database cannot sum, so only narrow projections are loaded and the figures are computed in Application.
/// </summary>
internal sealed class ReportQueries(BookstoreDbContext db, ReportingOptions options) : IReportQueries
{
    public async Task<ReportData> LoadAsync(ReportRequest request, CancellationToken ct)
    {
        var categories = await BookCategoriesAsync(request, ct);
        var lines = await SoldLinesAsync(request, categories, ct);
        var stock = await StockAsync(request, categories, ct);
        var currency = lines.Count > 0 ? lines[0].Revenue.Currency : new CurrencyCode(options.FallbackCurrency);
        var prices = await AveragePurchasePricesAsync(lines.Select(l => l.Book).Distinct().ToList(), ct);
        return new ReportData(lines, stock, prices, currency);
    }

    private static bool IsNarrowed(ReportRequest request) => request.Category is not null || request.Book is not null;

    /// <summary>The books in scope with their category; the category and book filters apply here.</summary>
    private async Task<Dictionary<BookId, CategoryId>> BookCategoriesAsync(ReportRequest request, CancellationToken ct)
    {
        var books = db.Set<Book>().AsNoTracking();
        if (request.Category is { } category)
            books = books.Where(b => b.CategoryId == category);
        if (request.Book is { } book)
            books = books.Where(b => b.Id == book);
        return await books.Select(b => new { b.Id, b.CategoryId }).ToDictionaryAsync(b => b.Id, b => b.CategoryId, ct);
    }

    private IQueryable<Sale> CompletedSales(ReportRequest request)
    {
        var sales = db.Set<Sale>().AsNoTracking()
            .Where(s => s.Status == Domain.Sales.SaleStatus.Completed)
            .Where(s => s.CompletedAt >= request.Period.Start && s.CompletedAt < request.Period.End);
        return request.Locations.Count == 0 ? sales : sales.Where(s => request.Locations.Contains(s.LocationId));
    }

    private async Task<List<SoldLineFact>> SoldLinesAsync(
        ReportRequest request, Dictionary<BookId, CategoryId> categories, CancellationToken ct)
    {
        var rows = await CompletedSales(request)
            .SelectMany(s => s.Lines, (s, l) => new
            {
                s.Id, s.LocationId, l.BookId, l.Quantity, Unit = l.UnitPrice, Discount = l.Discount.Amount,
            })
            .ToListAsync(ct);

        return rows
            .Where(r => !IsNarrowed(request) || categories.ContainsKey(r.BookId))
            .Select(r => new SoldLineFact(r.Id, r.LocationId, r.BookId,
                categories.TryGetValue(r.BookId, out var category) ? category : null,
                r.Quantity, r.Unit * r.Quantity - r.Discount))
            .ToList();
    }

    private async Task<List<StockFact>> StockAsync(
        ReportRequest request, Dictionary<BookId, CategoryId> categories, CancellationToken ct)
    {
        var stock = db.Set<StockItem>().AsNoTracking();
        if (request.Locations.Count > 0)
            stock = stock.Where(s => request.Locations.Contains(s.LocationId));
        var rows = await stock.Select(s => new { s.LocationId, s.BookId, s.OnHand, s.MinimumStock }).ToListAsync(ct);

        return rows
            .Where(r => !IsNarrowed(request) || categories.ContainsKey(r.BookId))
            .Select(r => new StockFact(r.LocationId, r.BookId, r.OnHand, r.MinimumStock))
            .ToList();
    }

    private async Task<Dictionary<BookId, decimal>> AveragePurchasePricesAsync(List<BookId> books, CancellationToken ct)
    {
        var prices = await db.Set<PurchaseOrder>().AsNoTracking()
            .Where(o => o.Status != PurchaseOrderStatus.Cancelled)
            .SelectMany(o => o.Lines)
            .Where(l => books.Contains(l.Id))
            .Select(l => new { Book = l.Id, l.PurchasePrice.Amount })
            .ToListAsync(ct);
        return prices.GroupBy(p => p.Book).ToDictionary(g => g.Key, g => g.Average(p => p.Amount));
    }
}
