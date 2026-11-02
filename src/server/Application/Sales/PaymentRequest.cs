namespace Application.Sales;

public sealed record PaymentRequest(PaymentMethod Method, Money Amount, string? GiftCertificateNumber);
