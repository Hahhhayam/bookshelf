namespace Application.Purchasing;

public sealed class GetPurchaseOrderUseCase(IPurchaseOrderQueries orders, ICurrentUser user, IClock clock)
{
    public async Task<PurchaseOrderView> ExecuteAsync(PurchaseOrderId orderId, CancellationToken ct)
    {
        user.RequireAny(Permissions.PurchasingManage, Permissions.ReceivingConfirm);
        return await orders.FindAsync(orderId, DateOnly.FromDateTime(clock.Now.UtcDateTime), ct)
            .OrNotFound("Purchase order");
    }
}
