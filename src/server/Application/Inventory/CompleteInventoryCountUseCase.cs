namespace Application.Inventory;

public sealed class CompleteInventoryCountUseCase(
    IInventoryCountRepository counts, ICurrentUser user, IUnitOfWork unitOfWork)
{
    public async Task ExecuteAsync(InventoryCountId countId, CancellationToken ct)
    {
        user.Require(Permissions.InventoryCountManage);
        var count = await counts.GetAsync(countId, ct).OrNotFound("Inventory count");
        user.RequireAccess(count.LocationId);

        count.CompleteCounting();
        await unitOfWork.CommitAsync(ct);
    }
}
