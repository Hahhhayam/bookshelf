namespace Application.Administration;

/// <param name="From">Inclusive; either end of the period may be left open.</param>
/// <param name="To">Exclusive.</param>
public sealed record AuditHistoryFilter(string? Subject, DateTimeOffset? From, DateTimeOffset? To, string? Action);

/// <summary>Scenario 3.10: the "History" tab of an entity.</summary>
public sealed class GetChangeHistoryUseCase(IAuditHistoryQuery history, ICurrentUser user)
{
    public Task<IReadOnlyList<AuditEntry>> ExecuteAsync(AuditHistoryFilter filter, CancellationToken ct)
    {
        user.Require(Permissions.AuditView);
        return history.FindAsync(filter, ct);
    }
}
