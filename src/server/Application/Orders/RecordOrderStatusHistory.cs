namespace Application.Orders;

public sealed class RecordOrderStatusHistory(IOrderStatusHistoryRepository history) : IEventHandler<OrderStatusChanged>
{
    public Task HandleAsync(OrderStatusChanged domainEvent, CancellationToken ct)
    {
        history.Add(OrderStatusChange.Record(domainEvent));
        return Task.CompletedTask;
    }
}
