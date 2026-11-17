namespace Application.Inventory;

/// <summary>The count sheet: expected quantities fixed when the count started, next to what was counted.</summary>
public sealed class GetInventoryCountUseCase(IInventoryCountQueries counts, ICurrentUser user)
{
    public async Task<InventoryCount> ExecuteAsync(InventoryCountId countId, CancellationToken ct)
    {
        user.RequireAny(Permissions.InventoryCountManage, Permissions.InventoryCountApprove);
        var count = await counts.FindAsync(countId, ct).OrNotFound("Inventory count");
        user.RequireAccess(count.LocationId);
        return count;
    }
}
