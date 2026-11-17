namespace Application.Inventory;

/// <summary>Local stock for the people who move it; the chain-wide view per item is the public book card.</summary>
public sealed class GetLocationStockUseCase(IStockQueries stock, ICurrentUser user)
{
    public Task<IReadOnlyList<StockLine>> ExecuteAsync(
        LocationId location, BookId? book, bool belowMinimumOnly, CancellationToken ct)
    {
        user.RequireAny(Permissions.SalesCreate, Permissions.StockAdjust, Permissions.TransfersManage,
            Permissions.InventoryCountManage, Permissions.InventoryCountApprove, Permissions.WriteOffCreate,
            Permissions.ReceivingConfirm, Permissions.PurchasingManage);
        user.RequireAccess(location);
        return stock.AtLocationAsync(location, book, belowMinimumOnly, ct);
    }
}
