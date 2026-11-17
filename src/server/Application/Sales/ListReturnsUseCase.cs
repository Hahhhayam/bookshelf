namespace Application.Sales;

/// <summary>Returns of the store by status; pending ones wait for the administrator's confirmation (scenario 3.6).</summary>
public sealed class ListReturnsUseCase(ISalesQueries queries, ICurrentUser user)
{
    public Task<IReadOnlyList<Return>> ExecuteAsync(LocationId location, ReturnStatus status, CancellationToken ct)
    {
        user.RequireAny(Permissions.ReturnsCreate, Permissions.ReturnsConfirm);
        user.RequireAccess(location);
        return queries.ListReturnsAsync(location, status, ct);
    }
}
