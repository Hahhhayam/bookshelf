namespace Application.Sales;

public interface ISaleRepository
{
    Task<Sale?> GetAsync(SaleId id, CancellationToken ct);

    /// <summary>Finds a sale posted earlier for the same operation key, so a resent request is not posted twice.</summary>
    Task<Sale?> FindByKeyAsync(IdempotencyKey key, CancellationToken ct);

    void Add(Sale sale);
}
