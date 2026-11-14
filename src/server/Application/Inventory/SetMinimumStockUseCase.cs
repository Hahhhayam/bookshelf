namespace Application.Inventory;

public sealed record SetMinimumStockCommand(LocationId Location, BookId Book, Quantity Minimum);

/// <summary>The threshold below which StockBelowMinimum raises a low-stock notification.</summary>
public sealed class SetMinimumStockUseCase(StockItemLoader stock, ICurrentUser user, IUnitOfWork unitOfWork)
{
    public async Task ExecuteAsync(SetMinimumStockCommand command, CancellationToken ct)
    {
        user.Require(Permissions.StockAdjust);
        user.RequireAccess(command.Location);

        var item = await stock.GetOrOpenAsync(command.Location, command.Book, ct);
        item.SetMinimumStock(command.Minimum);
        await unitOfWork.CommitAsync(ct);
    }
}
