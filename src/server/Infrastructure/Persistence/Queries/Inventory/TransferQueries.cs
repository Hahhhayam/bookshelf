using Application.Inventory;

namespace Infrastructure.Persistence.Queries.Inventory;

internal sealed class TransferQueries(BookstoreDbContext db) : ITransferQueries
{
    public async Task<TransferView?> FindAsync(TransferId transfer, CancellationToken ct)
    {
        var found = await db.Set<Transfer>().AsNoTracking().FirstOrDefaultAsync(t => t.Id == transfer, ct);
        if (found is null)
            return null;
        var history = await db.Set<TransferStatusChange>().AsNoTracking()
            .Where(c => c.ParentId == transfer).OrderBy(c => c.At).ToListAsync(ct);
        return new TransferView(found, history);
    }

    public async Task<IReadOnlyList<TransferSummary>> ListAsync(
        LocationId location, TransferStatus? status, CancellationToken ct)
    {
        var transfers = db.Set<Transfer>().AsNoTracking()
            .Where(t => t.Route.From == location || t.Route.To == location);
        transfers = status is { } wanted
            ? transfers.Where(t => t.Status == wanted)
            : transfers.Where(t => t.Status != TransferStatus.Received || t.Discrepancies.Any(d => !d.IsResolved));
        var rows = await transfers.ToListAsync(ct);

        var latest = await LatestChanges.ForAsync<TransferStatusChange, TransferId, TransferStatus>(
            db.Set<TransferStatusChange>(), rows.Select(t => t.Id).ToList(), ct);
        return rows.Select(t => new TransferSummary(t.Id, t.Route, t.Status, t.Discrepancies.Any(d => !d.IsResolved),
            latest.GetValueOrDefault(t.Id)?.At, latest.GetValueOrDefault(t.Id)?.By)).ToList();
    }
}
