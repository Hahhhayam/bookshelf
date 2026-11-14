namespace Application.Purchasing;

public sealed class RecordPurchaseOrderStatusHistory(IPurchaseOrderStatusHistoryRepository history)
    : IEventHandler<PurchaseOrderStatusChanged>
{
    public Task HandleAsync(PurchaseOrderStatusChanged domainEvent, CancellationToken ct)
    {
        history.Add(PurchaseOrderStatusChange.Record(domainEvent));
        return Task.CompletedTask;
    }
}
