using Application.Sales;

namespace Infrastructure.Persistence.Repositories.Sales;

internal sealed class SaleRepository(BookstoreDbContext db) : ISaleRepository
{
    public Task<Sale?> GetAsync(SaleId id, CancellationToken ct) =>
        db.Set<Sale>().AsSplitQuery().FirstOrDefaultAsync(s => s.Id == id, ct);

    public Task<Sale?> FindByKeyAsync(IdempotencyKey key, CancellationToken ct) =>
        db.Set<Sale>().AsSplitQuery().FirstOrDefaultAsync(s => s.IdempotencyKey == key, ct);

    public void Add(Sale sale) => db.Set<Sale>().Add(sale);
}
