using Application.Catalog;

namespace Infrastructure.Persistence.Repositories.Catalog;

internal sealed class ScheduledPriceRepository(BookstoreDbContext db) : IScheduledPriceRepository
{
    public Task<ScheduledPrice?> FindAsync(BookId book, CancellationToken ct) =>
        db.Set<ScheduledPrice>().FirstOrDefaultAsync(p => p.Id == book, ct);

    public async Task<IReadOnlyList<ScheduledPrice>> ListDueAsync(DateTimeOffset now, CancellationToken ct) =>
        await db.Set<ScheduledPrice>().Where(p => p.EffectiveFrom <= now).ToListAsync(ct);

    public void Add(ScheduledPrice price) => db.Set<ScheduledPrice>().Add(price);

    public void Remove(ScheduledPrice price) => db.Set<ScheduledPrice>().Remove(price);
}
