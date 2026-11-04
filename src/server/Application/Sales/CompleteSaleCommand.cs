namespace Application.Sales;

public sealed record CompleteSaleCommand(
    LocationId Location, CustomerId? Customer, IdempotencyKey Key,
    IReadOnlyList<SaleItemRequest> Items, IReadOnlyList<PaymentRequest> Payments);
