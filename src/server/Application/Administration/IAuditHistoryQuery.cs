namespace Application.Administration;

public interface IAuditHistoryQuery
{
    Task<IReadOnlyList<AuditRecord>> FindAsync(AuditHistoryFilter filter, CancellationToken ct);
}
