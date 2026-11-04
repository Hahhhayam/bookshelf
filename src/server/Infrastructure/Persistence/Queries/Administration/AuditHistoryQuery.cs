using Application.Administration;
using Domain.Administration;

namespace Infrastructure.Persistence.Queries.Administration;

internal sealed class AuditHistoryQuery(BookstoreDbContext db) : IAuditHistoryQuery
{
    public async Task<IReadOnlyList<AuditRecord>> FindAsync(AuditHistoryFilter filter, CancellationToken ct)
    {
        var records = db.Set<AuditRecord>().AsNoTracking();
        if (filter.Subject is not null)
            records = records.Where(r => r.Subject == filter.Subject);
        if (filter.Action is not null)
            records = records.Where(r => r.Action == filter.Action);
        if (filter.Period is { } period)
            records = records.Where(r => r.At >= period.Start && r.At < period.End);

        return await records.OrderByDescending(r => r.At).ToListAsync(ct);
    }
}
