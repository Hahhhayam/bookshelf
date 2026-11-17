namespace Application.Sales;

/// <summary>A row of the receipt list: the cashier's receipts of a shift or a day, or the receipt sought for a return.</summary>
public sealed record SaleSummary(
    SaleId Sale, UserId Cashier, CustomerId? Customer, DateTimeOffset CompletedAt, Domain.Sales.SaleStatus Status, Money Total);
