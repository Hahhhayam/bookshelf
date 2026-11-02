namespace Application.Inventory;

/// <summary>FR-13: opens a count with the currently recorded quantities as the expected ones.</summary>
public sealed class StartInventoryCountUseCase(
    IInventoryCountRepository counts, IStockItemRepository stockItems, ICurrentUser user, IUnitOfWork unitOfWork)
{
    public async Task<InventoryCountId> ExecuteAsync(LocationId location, CancellationToken ct)
    {
        user.Require(Permissions.InventoryCountManage);
        user.RequireAccess(location);

        var expected = (await stockItems.ListByLocationAsync(location, ct))
            .Select(s => new ItemQuantity(s.BookId, s.OnHand));
        var count = InventoryCount.Start(location, expected);
        counts.Add(count);
        await unitOfWork.CommitAsync(ct);
        return count.Id;
    }
}
