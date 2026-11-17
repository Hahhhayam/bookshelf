namespace Application.Inventory;

public sealed class ListInventoryCountsUseCase(IInventoryCountQueries counts, ICurrentUser user)
{
    public Task<IReadOnlyList<InventoryCountSummary>> ExecuteAsync(LocationId location, CancellationToken ct)
    {
        user.RequireAny(Permissions.InventoryCountManage, Permissions.InventoryCountApprove);
        user.RequireAccess(location);
        return counts.ListAsync(location, ct);
    }
}
