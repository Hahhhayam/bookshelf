namespace Application.Inventory;

public sealed record CreateTransferCommand(Route Route, IReadOnlyList<ItemQuantity> Items);

/// <summary>Scenario 3.7, step 1. The sender must have enough available stock.</summary>
public sealed class CreateTransferUseCase(
    ITransferRepository transfers, StockItemLoader stock, ICurrentUser user, IUnitOfWork unitOfWork)
{
    public async Task<TransferId> ExecuteAsync(CreateTransferCommand command, CancellationToken ct)
    {
        user.Require(Permissions.TransfersManage);
        user.RequireAccess(command.Route.From);

        var senderStock = await stock.RequireManyAsync(command.Route.From, command.Items.Select(i => i.BookId), ct);
        StockAvailability.EnsureAvailable(senderStock, command.Items);

        var transfer = Transfer.Create(command.Route, command.Items);
        transfers.Add(transfer);
        await unitOfWork.CommitAsync(ct);
        return transfer.Id;
    }
}
