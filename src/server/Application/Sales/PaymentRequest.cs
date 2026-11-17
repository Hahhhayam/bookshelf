namespace Application.Sales;

/// <param name="Tendered">Cash handed over by the customer, when more than <paramref name="Amount"/>; the rest is change.</param>
public sealed record PaymentRequest(PaymentMethod Method, Money Amount, string? GiftCertificateNumber, Money? Tendered = null);
