using Application.Sales;

namespace Infrastructure.Persistence.Queries.Sales;

internal sealed class SalesQueries(BookstoreDbContext db) : ISalesQueries
{
    public async Task<IReadOnlyList<SaleSummary>> ListSalesAsync(
        LocationId location, DateTimeOffset from, DateTimeOffset to, UserId? cashier, CancellationToken ct)
    {
        var sales = db.Set<Sale>().AsNoTracking().IgnoreAutoIncludes()
            .Where(s => s.LocationId == location && s.CompletedAt >= from && s.CompletedAt < to);
        if (cashier is { } wanted)
            sales = sales.Where(s => s.Cashier == wanted);
        var rows = await sales.OrderByDescending(s => s.CompletedAt).ToListAsync(ct);
        return rows.Select(s => new SaleSummary(s.Id, s.Cashier, s.CustomerId, s.CompletedAt, s.Status, s.Total)).ToList();
    }

    public async Task<IReadOnlyList<Return>> ListReturnsAsync(
        LocationId location, ReturnStatus status, CancellationToken ct) =>
        await db.Set<Return>().AsNoTracking()
            .Where(r => r.LocationId == location && r.Status == status)
            .ToListAsync(ct);
}
