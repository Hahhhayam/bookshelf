using Application.Purchasing;

namespace Infrastructure.Persistence.Repositories.Purchasing;

internal sealed class GoodsReceiptRepository(BookstoreDbContext db) : IGoodsReceiptRepository
{
    public void Add(GoodsReceipt receipt) => db.Set<GoodsReceipt>().Add(receipt);
}
