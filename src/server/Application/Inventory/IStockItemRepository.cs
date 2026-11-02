namespace Application.Inventory;

public interface IStockItemRepository
{
    Task<StockItem?> FindAsync(LocationId location, BookId book, CancellationToken ct);

    Task<IReadOnlyList<StockItem>> ListByLocationAsync(LocationId location, CancellationToken ct);

    Task<IReadOnlyList<StockItem>> ListWithExpiredReservationsAsync(DateTimeOffset now, CancellationToken ct);

    void Add(StockItem item);
}
