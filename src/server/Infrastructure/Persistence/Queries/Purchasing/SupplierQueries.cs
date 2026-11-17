using Application.Purchasing;

namespace Infrastructure.Persistence.Queries.Purchasing;

internal sealed class SupplierQueries(BookstoreDbContext db) : ISupplierQueries
{
    public async Task<IReadOnlyList<Supplier>> ListAsync(CancellationToken ct) =>
        await db.Set<Supplier>().AsNoTracking().OrderBy(s => s.Name).ToListAsync(ct);
}
