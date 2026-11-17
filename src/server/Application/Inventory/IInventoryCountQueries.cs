namespace Application.Inventory;

public interface IInventoryCountQueries
{
    Task<InventoryCount?> FindAsync(InventoryCountId count, CancellationToken ct);

    /// <summary>Every count of the location, newest first.</summary>
    Task<IReadOnlyList<InventoryCountSummary>> ListAsync(LocationId location, CancellationToken ct);
}
