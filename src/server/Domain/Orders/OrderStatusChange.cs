namespace Domain.Orders;

public sealed class OrderStatusChange : Change<OrderId, OrderStatus>
{
    private OrderStatusChange(Guid id, OrderId parentId, OrderStatus from, OrderStatus to, DateTimeOffset at, UserId by)
        : base(id, parentId, from, to, at, by) { }

    public static OrderStatusChange Record(OrderStatusChanged domainEvent) =>
        new(domainEvent.EventId, domainEvent.OrderId, domainEvent.From, domainEvent.To,
            domainEvent.OccurredAt, domainEvent.ChangedBy);
}
