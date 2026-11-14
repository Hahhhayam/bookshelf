namespace Application.Inventory;

/// <summary>Either end of the route may look at the transfer.</summary>
public sealed class GetTransferUseCase(ITransferQueries transfers, ICurrentUser user)
{
    public async Task<TransferView> ExecuteAsync(TransferId transferId, CancellationToken ct)
    {
        user.Require(Permissions.TransfersManage);
        var view = await transfers.FindAsync(transferId, ct).OrNotFound("Transfer");
        var route = view.Transfer.Route;
        if (!user.CanAccess(route.From))
            user.RequireAccess(route.To);
        return view;
    }
}
