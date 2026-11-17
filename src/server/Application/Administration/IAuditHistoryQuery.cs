namespace Application.Administration;

public interface IAuditHistoryQuery
{
    Task<IReadOnlyList<AuditEntry>> FindAsync(AuditHistoryFilter filter, CancellationToken ct);
}
