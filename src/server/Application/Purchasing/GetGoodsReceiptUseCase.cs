namespace Application.Purchasing;

/// <summary>One receipt with its lines and the discrepancies recorded separately (FR-12, scenario 3.9).</summary>
public sealed class GetGoodsReceiptUseCase(IGoodsReceiptQueries receipts, ICurrentUser user)
{
    public async Task<GoodsReceipt> ExecuteAsync(GoodsReceiptId receiptId, CancellationToken ct)
    {
        user.RequireAny(Permissions.ReceivingConfirm, Permissions.PurchasingManage);
        var receipt = await receipts.FindAsync(receiptId, ct).OrNotFound("Goods receipt");
        user.RequireAccess(receipt.LocationId);
        return receipt;
    }
}
