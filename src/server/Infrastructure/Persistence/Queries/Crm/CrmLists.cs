using Application.Crm;

namespace Infrastructure.Persistence.Queries.Crm;

internal sealed class CrmLists(BookstoreDbContext db) : ICrmLists
{
    public async Task<IReadOnlyList<Promotion>> PromotionsAsync(CancellationToken ct) =>
        await db.Set<Promotion>().AsNoTracking().OrderByDescending(p => p.Period.Start).ToListAsync(ct);

    public async Task<IReadOnlyList<Segment>> SegmentsAsync(CancellationToken ct) =>
        await db.Set<Segment>().AsNoTracking().OrderBy(s => s.Name).ToListAsync(ct);
}
