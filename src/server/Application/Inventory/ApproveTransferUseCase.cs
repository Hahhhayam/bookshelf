namespace Application.Inventory;

/// <summary>Scenario 3.7, step 2: after approval the goods are reserved at the sender.</summary>
public sealed class ApproveTransferUseCase(
    ITransferRepository transfers, StockItemLoader stock, ICurrentUser user, IClock clock, IUnitOfWork unitOfWork)
{
    public async Task ExecuteAsync(TransferId transferId, CancellationToken ct)
    {
        user.Require(Permissions.TransfersManage);
        var transfer = await transfers.GetAsync(transferId, ct).OrNotFound("Transfer");
        user.RequireAccess(transfer.Route.From);

        transfer.Approve(clock.Now);
        foreach (var line in transfer.Lines)
        {
            var item = await stock.RequireAsync(transfer.Route.From, line.Id, ct);
            item.Reserve(line.Shipped, ReservationPurpose.Transfer, transfer.Id.Value);
        }
        await unitOfWork.CommitAsync(ct);
    }
}
