using Application.Inventory;

namespace Infrastructure.Persistence.Repositories.Inventory;

internal sealed class TransferStatusHistoryRepository(BookstoreDbContext db) : ITransferStatusHistoryRepository
{
    public void Add(TransferStatusChange change) => db.Set<TransferStatusChange>().Add(change);
}
