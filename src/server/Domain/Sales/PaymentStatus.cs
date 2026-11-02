namespace Domain.Sales;

/// <summary>Separate payment state, so a sale can survive an unavailable payment service.</summary>
public enum PaymentStatus { Pending, Captured, Failed }
