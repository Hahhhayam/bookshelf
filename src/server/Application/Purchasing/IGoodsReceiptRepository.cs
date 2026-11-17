namespace Application.Purchasing;

public interface IGoodsReceiptRepository
{
    Task<GoodsReceipt?> FindByKeyAsync(IdempotencyKey key, CancellationToken ct);

    void Add(GoodsReceipt receipt);
}
