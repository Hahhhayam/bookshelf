namespace Application.Catalog;

public interface IPriceHistoryRepository
{
    Task<bool> ExistsAsync(Guid entryId, CancellationToken ct);

    void Add(PriceEntry entry);
}
