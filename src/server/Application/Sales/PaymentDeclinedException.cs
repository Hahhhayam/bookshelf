namespace Application.Sales;

public sealed class PaymentDeclinedException() : Exception("The card payment was declined.")
{
    public const string Code = "payment-declined";
}
