namespace Application.Administration;

public sealed record AuditHistoryFilter(string? Subject, Period? Period, string? Action);
