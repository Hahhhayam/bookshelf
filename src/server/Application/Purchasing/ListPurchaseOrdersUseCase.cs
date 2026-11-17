namespace Application.Purchasing;

/// <summary>Includes the "unfulfilled deliveries" view the purchasing manager needs (overdue only).</summary>
public sealed class ListPurchaseOrdersUseCase(IPurchaseOrderQueries orders, ICurrentUser user, IClock clock)
{
    public Task<IReadOnlyList<PurchaseOrderSummary>> ExecuteAsync(
        PurchaseOrderStatus? status, bool openOnly, bool overdueOnly, CancellationToken ct)
    {
        user.RequireAny(Permissions.PurchasingManage, Permissions.ReceivingConfirm);
        return orders.ListAsync(status, openOnly, overdueOnly, DateOnly.FromDateTime(clock.Now.UtcDateTime), ct);
    }
}
