namespace Application.Purchasing;

public interface IGoodsReceiptQueries
{
    Task<GoodsReceipt?> FindAsync(GoodsReceiptId receipt, CancellationToken ct);

    /// <summary>Receipts confirmed at the location, newest first.</summary>
    Task<IReadOnlyList<GoodsReceiptSummary>> ListAsync(LocationId location, CancellationToken ct);
}
