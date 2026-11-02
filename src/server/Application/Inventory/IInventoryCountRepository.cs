namespace Application.Inventory;

public interface IInventoryCountRepository
{
    Task<InventoryCount?> GetAsync(InventoryCountId id, CancellationToken ct);

    void Add(InventoryCount count);
}
