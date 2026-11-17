namespace Application.Inventory;

/// <summary>Scenario 3.7, step 3: the sender confirms shipment; the reserved goods leave its stock.</summary>
public sealed class ShipTransferUseCase(
    ITransferRepository transfers, StockItemLoader stock, ICurrentUser user, IClock clock, IUnitOfWork unitOfWork)
{
    public async Task ExecuteAsync(TransferId transferId, CancellationToken ct)
    {
        user.Require(Permissions.TransfersManage);
        var transfer = await transfers.GetAsync(transferId, ct).OrNotFound("Transfer");
        user.RequireAccess(transfer.Route.From);

        transfer.Ship(user.Id, clock.Now);
        foreach (var line in transfer.Lines)
            await ReleaseFromSenderAsync(transfer, line.Id, ct);
        await unitOfWork.CommitAsync(ct);
    }

    private async Task ReleaseFromSenderAsync(Transfer transfer, BookId book, CancellationToken ct)
    {
        var item = await stock.RequireAsync(transfer.Route.From, book, ct);
        var reservation = item.FindActiveReservation(transfer.Id.Value)
                          ?? throw new DomainException("reservation-not-found", "The transfer has no reservation at the sender.");
        item.FulfilReservation(reservation, clock.Now);
    }
}
