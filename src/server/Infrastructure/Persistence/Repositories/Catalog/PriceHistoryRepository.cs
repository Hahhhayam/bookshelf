using Application.Catalog;
using Domain.Catalog;

namespace Infrastructure.Persistence.Repositories.Catalog;

internal sealed class PriceHistoryRepository(BookstoreDbContext db) : IPriceHistoryRepository
{
    public Task<bool> ExistsAsync(Guid entryId, CancellationToken ct) =>
        db.Set<PriceEntry>().AnyAsync(e => e.Id == entryId, ct);

    public void Add(PriceEntry entry) => db.Set<PriceEntry>().Add(entry);
}
