using Application.Purchasing;

namespace Infrastructure.Persistence.Queries.Purchasing;

internal sealed class MissingBookRequestQueries(BookstoreDbContext db) : IMissingBookRequestQueries
{
    public async Task<IReadOnlyList<MissingBookRequest>> ListOpenAsync(LocationId location, CancellationToken ct) =>
        await db.Set<MissingBookRequest>().AsNoTracking()
            .Where(r => r.LocationId == location && r.Status == MissingBookRequestStatus.Open)
            .OrderByDescending(r => r.Demand).ThenBy(r => r.RecordedAt)
            .ToListAsync(ct);
}
