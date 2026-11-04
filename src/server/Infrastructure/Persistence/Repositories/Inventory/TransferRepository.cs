using Application.Inventory;
using Domain.Inventory;

namespace Infrastructure.Persistence.Repositories.Inventory;

internal sealed class TransferRepository(BookstoreDbContext db) : ITransferRepository
{
    public Task<Transfer?> GetAsync(TransferId id, CancellationToken ct) =>
        db.Set<Transfer>().AsSplitQuery().FirstOrDefaultAsync(t => t.Id == id, ct);

    public void Add(Transfer transfer) => db.Set<Transfer>().Add(transfer);
}
