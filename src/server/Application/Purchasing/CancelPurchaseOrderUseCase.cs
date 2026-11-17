namespace Application.Purchasing;

public sealed class CancelPurchaseOrderUseCase(
    IPurchaseOrderRepository orders, ICurrentUser user, IClock clock, IUnitOfWork unitOfWork)
{
    public async Task ExecuteAsync(PurchaseOrderId orderId, CancellationToken ct)
    {
        user.Require(Permissions.PurchasingManage);
        var order = await orders.GetAsync(orderId, ct).OrNotFound("Purchase order");

        order.Cancel(user.Id, clock.Now);
        await unitOfWork.CommitAsync(ct);
    }
}
