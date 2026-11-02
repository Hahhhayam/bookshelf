namespace Application.Inventory;

/// <summary>FR-13: stock adjustments are generated only once the count is approved.</summary>
public sealed class ApproveInventoryCountUseCase(
    IInventoryCountRepository counts, StockItemLoader stock, ICurrentUser user, IClock clock, AuditTrail audit,
    IUnitOfWork unitOfWork)
{
    private static readonly AdjustmentReason CountReason = new("Inventory count");

    public async Task ExecuteAsync(InventoryCountId countId, CancellationToken ct)
    {
        user.Require(Permissions.InventoryCountApprove);
        var count = await counts.GetAsync(countId, ct).OrNotFound("Inventory count");
        user.RequireAccess(count.LocationId);

        count.Approve();
        var adjustments = count.Post(clock.Now);
        foreach (var adjustment in adjustments)
            await ApplyAsync(count, adjustment, ct);

        audit.Record("inventory-count.posted", countId.ToString(), after: $"{adjustments.Count} adjustments");
        await unitOfWork.CommitAsync(ct);
    }

    private async Task ApplyAsync(InventoryCount count, CountAdjustment adjustment, CancellationToken ct)
    {
        var item = await stock.GetOrOpenAsync(count.LocationId, adjustment.BookId, ct);
        item.Adjust(adjustment.NewOnHand, CountReason, user.Id, count.Id.Value, clock.Now);
    }
}
