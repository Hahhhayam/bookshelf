namespace Application.Common;

public enum NotificationKind { OrderReady, LowStock, OverdueDelivery, IntegrationFailure }

/// <summary>Adapter for e-mail/SMS. Failures are retried by the adapter and must not block the caller.</summary>
public interface INotificationSender
{
    Task NotifyCustomerAsync(CustomerId customer, NotificationKind kind, string message, CancellationToken ct);

    /// <param name="location">The location whose staff should be told; null means chain-level staff.</param>
    Task NotifyStaffAsync(NotificationKind kind, LocationId? location, string message, CancellationToken ct);
}
