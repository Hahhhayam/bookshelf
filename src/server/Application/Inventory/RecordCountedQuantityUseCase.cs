namespace Application.Inventory;

public sealed class RecordCountedQuantityUseCase(
    IInventoryCountRepository counts, ICurrentUser user, IUnitOfWork unitOfWork)
{
    public async Task ExecuteAsync(InventoryCountId countId, BookId book, Quantity counted, CancellationToken ct)
    {
        user.Require(Permissions.InventoryCountManage);
        var count = await counts.GetAsync(countId, ct).OrNotFound("Inventory count");
        user.RequireAccess(count.LocationId);

        count.RecordCount(book, counted);
        await unitOfWork.CommitAsync(ct);
    }
}
