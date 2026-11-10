using System.Net;
using System.Net.Mail;
using Domain.Crm;
using Infrastructure.Persistence;
using Microsoft.Extensions.Logging;
using Microsoft.Extensions.Options;

namespace Infrastructure.Notifications;

/// <summary>Retries a failed delivery a few times, then logs it: a notification must never fail the caller's operation.</summary>
internal sealed class SmtpNotificationSender(
    BookstoreDbContext db, IOptions<SmtpOptions> options, ILogger<SmtpNotificationSender> logger) : INotificationSender
{
    private static readonly TimeSpan[] RetryDelays = [TimeSpan.FromMilliseconds(500), TimeSpan.FromSeconds(2)];

    public async Task NotifyCustomerAsync(CustomerId customer, NotificationKind kind, string message, CancellationToken ct)
    {
        var email = await db.Set<Customer>().AsNoTracking()
            .Where(c => c.Id == customer)
            .Select(c => c.Contact.Email)
            .FirstOrDefaultAsync(ct);
        await SendAsync(email, kind, message, ct);
    }

    public Task NotifyStaffAsync(NotificationKind kind, LocationId? location, string message, CancellationToken ct) =>
        SendAsync(StaffAddress(location), kind, message, ct);

    private string? StaffAddress(LocationId? location) =>
        location is { } id && options.Value.LocationStaffAddresses.TryGetValue(id.Value, out var address)
            ? address
            : options.Value.ChainStaffAddress;

    private async Task SendAsync(string? to, NotificationKind kind, string message, CancellationToken ct)
    {
        if (string.IsNullOrWhiteSpace(to))
        {
            logger.LogWarning("No e-mail address for the {Kind} notification; it was not sent.", kind);
            return;
        }

        using var mail = new MailMessage(options.Value.From, to, SubjectFor(kind), message);
        for (var attempt = 0; ; attempt++)
        {
            try
            {
                await DeliverAsync(mail, ct);
                return;
            }
            catch (Exception e) when (e is SmtpException or IOException && attempt < RetryDelays.Length)
            {
                await Task.Delay(RetryDelays[attempt], ct);
            }
            catch (Exception e) when (e is SmtpException or IOException)
            {
                logger.LogError(e, "The {Kind} notification to {To} could not be delivered.", kind, to);
                return;
            }
        }
    }

    private async Task DeliverAsync(MailMessage mail, CancellationToken ct)
    {
        var smtp = options.Value;
        using var client = new SmtpClient(smtp.Host, smtp.Port) { EnableSsl = smtp.UseSsl };
        if (smtp.Username is not null)
            client.Credentials = new NetworkCredential(smtp.Username, smtp.Password);
        await client.SendMailAsync(mail, ct);
    }

    private static string SubjectFor(NotificationKind kind) => kind switch
    {
        NotificationKind.OrderReady => "Your order is ready",
        NotificationKind.LowStock => "Low stock",
        NotificationKind.OverdueDelivery => "Overdue supplier delivery",
        NotificationKind.IntegrationFailure => "Integration failure",
        _ => "Bookstore notification",
    };
}
