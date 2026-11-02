namespace Application.Purchasing;

public sealed class NotifyStaffOverdueDelivery(INotificationSender notifications) : IEventHandler<PurchaseOrderOverdue>
{
    public Task HandleAsync(PurchaseOrderOverdue domainEvent, CancellationToken ct) =>
        notifications.NotifyStaffAsync(NotificationKind.OverdueDelivery, null,
            $"Purchase order {domainEvent.PurchaseOrderId} was expected on {domainEvent.ExpectedDate} and is overdue.", ct);
}
