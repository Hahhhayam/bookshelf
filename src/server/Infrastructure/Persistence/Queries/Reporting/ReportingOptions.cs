namespace Infrastructure.Persistence.Queries.Reporting;

/// <param name="FallbackCurrency">Used for a report period in which nothing was sold, so no amount carries a currency.</param>
public sealed record ReportingOptions(string FallbackCurrency = "UAH");
