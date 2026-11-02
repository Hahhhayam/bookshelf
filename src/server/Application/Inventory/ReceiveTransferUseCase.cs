namespace Application.Inventory;

/// <summary>Scenario 3.7, step 4: the receiver records the actual quantity; a mismatch becomes a discrepancy.</summary>
public sealed class ReceiveTransferUseCase(
    ITransferRepository transfers, StockItemLoader stock, ICurrentUser user, IClock clock, IUnitOfWork unitOfWork)
{
    public async Task ExecuteAsync(TransferId transferId, IReadOnlyList<ItemQuantity> received, CancellationToken ct)
    {
        user.Require(Permissions.TransfersManage);
        var transfer = await transfers.GetAsync(transferId, ct).OrNotFound("Transfer");
        user.RequireAccess(transfer.Route.To);

        transfer.Receive(received.ToDictionary(r => r.BookId, r => r.Quantity), user.Id, clock.Now);
        foreach (var line in transfer.Lines.Where(l => l.Received is { IsZero: false }))
            await AddToReceiverAsync(transfer, line, ct);
        await unitOfWork.CommitAsync(ct);
    }

    private async Task AddToReceiverAsync(Transfer transfer, TransferLine line, CancellationToken ct)
    {
        var item = await stock.GetOrOpenAsync(transfer.Route.To, line.Id, ct);
        item.ReceiveTransfer(line.Received!.Value, transfer.Id.Value, clock.Now);
    }
}
