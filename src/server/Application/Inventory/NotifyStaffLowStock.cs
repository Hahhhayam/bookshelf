namespace Application.Inventory;

public sealed class NotifyStaffLowStock(INotificationSender notifications) : IEventHandler<StockBelowMinimum>
{
    public Task HandleAsync(StockBelowMinimum domainEvent, CancellationToken ct) =>
        notifications.NotifyStaffAsync(NotificationKind.LowStock, domainEvent.LocationId,
            $"Stock of book {domainEvent.BookId} fell to {domainEvent.OnHand} (minimum {domainEvent.Minimum}).", ct);
}
