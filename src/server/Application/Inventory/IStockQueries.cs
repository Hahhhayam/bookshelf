namespace Application.Inventory;

public interface IStockQueries
{
    Task<IReadOnlyList<StockLine>> AtLocationAsync(
        LocationId location, BookId? book, bool belowMinimumOnly, CancellationToken ct);
}
