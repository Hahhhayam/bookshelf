namespace Application.Administration;

/// <summary>The connections with their state, for the administrator who watches them (FR-18).</summary>
public sealed class ListIntegrationsUseCase(IAdministrationQueries queries, ICurrentUser user)
{
    public Task<IReadOnlyList<Integration>> ExecuteAsync(CancellationToken ct)
    {
        user.Require(Permissions.IntegrationsManage);
        return queries.IntegrationsAsync(ct);
    }
}
