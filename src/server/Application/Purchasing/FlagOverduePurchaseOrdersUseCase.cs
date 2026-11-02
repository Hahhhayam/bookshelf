namespace Application.Purchasing;

/// <summary>Background job: orders late against their expected date raise PurchaseOrderOverdue once.</summary>
public sealed class FlagOverduePurchaseOrdersUseCase(IPurchaseOrderRepository orders, IClock clock, IUnitOfWork unitOfWork)
{
    public async Task ExecuteAsync(CancellationToken ct)
    {
        var now = clock.Now;
        var today = DateOnly.FromDateTime(now.UtcDateTime);
        foreach (var order in await orders.ListAwaitingDeliveryAsync(ct))
            order.CheckOverdue(today, now);
        await unitOfWork.CommitAsync(ct);
    }
}
