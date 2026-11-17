using Application.Administration;

namespace Infrastructure.Persistence.Queries.Administration;

internal sealed class AuditHistoryQuery(BookstoreDbContext db) : IAuditHistoryQuery
{
    public async Task<IReadOnlyList<AuditEntry>> FindAsync(AuditHistoryFilter filter, CancellationToken ct)
    {
        var records = await Filtered(filter).OrderByDescending(r => r.At).ToListAsync(ct);
        var logins = await LoginsAsync(records, ct);
        return records.Select(r => new AuditEntry(r, r.By is { } by ? logins.GetValueOrDefault(by) : null)).ToList();
    }

    private IQueryable<AuditRecord> Filtered(AuditHistoryFilter filter)
    {
        var records = db.Set<AuditRecord>().AsNoTracking();
        if (filter.Subject is not null)
            records = records.Where(r => r.Subject == filter.Subject);
        if (filter.Action is not null)
            records = records.Where(r => r.Action == filter.Action);
        if (filter.From is { } from)
            records = records.Where(r => r.At >= from);
        if (filter.To is { } to)
            records = records.Where(r => r.At < to);
        return records;
    }

    private async Task<Dictionary<UserId, string>> LoginsAsync(List<AuditRecord> records, CancellationToken ct)
    {
        var users = records.Where(r => r.By is not null).Select(r => r.By!.Value).Distinct().ToList();
        return await db.Set<User>().AsNoTracking().Where(u => users.Contains(u.Id))
            .ToDictionaryAsync(u => u.Id, u => u.Login, ct);
    }
}
