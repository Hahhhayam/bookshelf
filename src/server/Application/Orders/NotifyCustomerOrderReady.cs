namespace Application.Orders;

public sealed class NotifyCustomerOrderReady(INotificationSender notifications) : IEventHandler<OrderReady>
{
    public Task HandleAsync(OrderReady domainEvent, CancellationToken ct) =>
        notifications.NotifyCustomerAsync(domainEvent.CustomerId, NotificationKind.OrderReady,
            $"Your order is ready. Pickup code: {domainEvent.PickupCode}.", ct);
}
