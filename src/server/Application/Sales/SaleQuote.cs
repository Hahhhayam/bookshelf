namespace Application.Sales;

/// <summary>A receipt priced exactly as the sale will price it, so the till asks for the right amount.</summary>
public sealed record SaleQuote(IReadOnlyList<SaleLine> Lines, Money Total, BonusWriteOff? Bonus);
