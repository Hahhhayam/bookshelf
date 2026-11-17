namespace Application.Reporting;

/// <summary>The headline figures of a period, for comparing the report's period with the one before it.</summary>
public sealed record PeriodTotals(Money Revenue, Money Margin, int Receipts, Money AverageCheck);
