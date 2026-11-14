using Application.Purchasing;

namespace Infrastructure.Persistence.Repositories.Purchasing;

internal sealed class PurchaseOrderStatusHistoryRepository(BookstoreDbContext db) : IPurchaseOrderStatusHistoryRepository
{
    public void Add(PurchaseOrderStatusChange change) => db.Set<PurchaseOrderStatusChange>().Add(change);
}
