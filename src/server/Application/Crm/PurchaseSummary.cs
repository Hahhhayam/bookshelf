namespace Application.Crm;

public sealed record PurchaseSummary(
    SaleId Sale, LocationId Location, DateTimeOffset At, Money Total, Domain.Sales.SaleStatus Status);
