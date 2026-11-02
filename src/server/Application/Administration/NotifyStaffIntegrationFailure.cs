namespace Application.Administration;

public sealed class NotifyStaffIntegrationFailure(INotificationSender notifications)
    : IEventHandler<IntegrationFailed>
{
    public Task HandleAsync(IntegrationFailed domainEvent, CancellationToken ct) =>
        notifications.NotifyStaffAsync(NotificationKind.IntegrationFailure, null,
            $"Integration '{domainEvent.Kind}' failed: {domainEvent.Error}", ct);
}
