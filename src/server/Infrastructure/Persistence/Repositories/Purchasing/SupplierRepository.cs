using Application.Purchasing;

namespace Infrastructure.Persistence.Repositories.Purchasing;

internal sealed class SupplierRepository(BookstoreDbContext db) : ISupplierRepository
{
    public Task<Supplier?> GetAsync(SupplierId id, CancellationToken ct) =>
        db.Set<Supplier>().FirstOrDefaultAsync(s => s.Id == id, ct);
}
