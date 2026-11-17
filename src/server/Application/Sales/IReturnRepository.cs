namespace Application.Sales;

public interface IReturnRepository
{
    Task<Return?> GetAsync(ReturnId id, CancellationToken ct);

    /// <summary>Finds a return created earlier for the same operation key, so a resent request is not created twice.</summary>
    Task<Return?> FindByKeyAsync(IdempotencyKey key, CancellationToken ct);

    /// <summary>Quantities per book already returned for the sale by confirmed and pending returns.</summary>
    Task<IReadOnlyDictionary<BookId, Quantity>> ReturnedQuantitiesAsync(SaleId sale, CancellationToken ct);

    void Add(Return ret);
}
