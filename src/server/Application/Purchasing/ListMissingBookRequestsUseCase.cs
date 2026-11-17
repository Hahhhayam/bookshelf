namespace Application.Purchasing;

/// <summary>
/// Need forming (table 2.1): next to the stock below minimum, the open requests for books the chain does not have
/// tell the purchasing manager what else to order for the location.
/// </summary>
public sealed class ListMissingBookRequestsUseCase(IMissingBookRequestQueries requests, ICurrentUser user)
{
    public Task<IReadOnlyList<MissingBookRequest>> ExecuteAsync(LocationId location, CancellationToken ct)
    {
        user.Require(Permissions.PurchasingManage);
        user.RequireAccess(location);
        return requests.ListOpenAsync(location, ct);
    }
}
