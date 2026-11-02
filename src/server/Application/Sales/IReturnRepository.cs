namespace Application.Sales;

public interface IReturnRepository
{
    Task<Return?> GetAsync(ReturnId id, CancellationToken ct);

    /// <summary>Quantities per book already returned for the sale by confirmed and pending returns.</summary>
    Task<IReadOnlyDictionary<BookId, Quantity>> ReturnedQuantitiesAsync(SaleId sale, CancellationToken ct);

    void Add(Return ret);
}
