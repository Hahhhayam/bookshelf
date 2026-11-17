using Application.Purchasing;

namespace Infrastructure.Persistence.Repositories.Purchasing;

internal sealed class GoodsReceiptRepository(BookstoreDbContext db) : IGoodsReceiptRepository
{
    public Task<GoodsReceipt?> FindByKeyAsync(IdempotencyKey key, CancellationToken ct) =>
        db.Set<GoodsReceipt>().AsSplitQuery().FirstOrDefaultAsync(r => r.IdempotencyKey == key, ct);

    public void Add(GoodsReceipt receipt) => db.Set<GoodsReceipt>().Add(receipt);
}
