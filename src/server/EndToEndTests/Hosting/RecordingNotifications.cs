using System.Collections.Concurrent;

namespace EndToEndTests.Hosting;

/// <summary>Stands in for e-mail/SMS and remembers what would have been sent.</summary>
public sealed class RecordingNotifications : INotificationSender
{
    private readonly ConcurrentQueue<SentNotification> _sent = new();

    public IReadOnlyCollection<SentNotification> Sent => _sent.ToArray();

    public Task NotifyCustomerAsync(CustomerId customer, NotificationKind kind, string message, CancellationToken ct)
    {
        _sent.Enqueue(new SentNotification(kind, customer, null, message));
        return Task.CompletedTask;
    }

    public Task NotifyStaffAsync(NotificationKind kind, LocationId? location, string message, CancellationToken ct)
    {
        _sent.Enqueue(new SentNotification(kind, null, location, message));
        return Task.CompletedTask;
    }
}
