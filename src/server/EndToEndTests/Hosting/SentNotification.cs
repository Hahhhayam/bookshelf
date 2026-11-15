namespace EndToEndTests.Hosting;

public sealed record SentNotification(NotificationKind Kind, CustomerId? Customer, LocationId? Location, string Message);
