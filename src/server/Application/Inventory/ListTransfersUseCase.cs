namespace Application.Inventory;

public sealed class ListTransfersUseCase(ITransferQueries transfers, ICurrentUser user)
{
    public Task<IReadOnlyList<TransferSummary>> ExecuteAsync(
        LocationId location, TransferStatus? status, CancellationToken ct)
    {
        user.Require(Permissions.TransfersManage);
        user.RequireAccess(location);
        return transfers.ListAsync(location, status, ct);
    }
}
