namespace Application.Administration;

public sealed record AuditHistoryFilter(string? Subject, Period? Period, string? Action);

/// <summary>Scenario 3.10: the "History" tab of an entity.</summary>
public sealed class GetChangeHistoryUseCase(IAuditHistoryQuery history, ICurrentUser user)
{
    public Task<IReadOnlyList<AuditRecord>> ExecuteAsync(AuditHistoryFilter filter, CancellationToken ct)
    {
        user.Require(Permissions.AuditView);
        return history.FindAsync(filter, ct);
    }
}
