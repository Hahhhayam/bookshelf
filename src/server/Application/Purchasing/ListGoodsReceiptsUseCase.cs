namespace Application.Purchasing;

public sealed class ListGoodsReceiptsUseCase(IGoodsReceiptQueries receipts, ICurrentUser user)
{
    public Task<IReadOnlyList<GoodsReceiptSummary>> ExecuteAsync(LocationId location, CancellationToken ct)
    {
        user.RequireAny(Permissions.ReceivingConfirm, Permissions.PurchasingManage);
        user.RequireAccess(location);
        return receipts.ListAsync(location, ct);
    }
}
