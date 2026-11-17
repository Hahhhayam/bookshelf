namespace Application.Sales;

/// <summary>Turns payment requests into payments: charges cards and spends gift certificates.</summary>
public sealed class SalePaymentSettler(IPaymentGateway gateway, IGiftCertificateRepository certificates)
{
    public async Task<IReadOnlyList<Payment>> SettleAsync(
        IReadOnlyList<PaymentRequest> requests, IdempotencyKey saleKey, CancellationToken ct)
    {
        var payments = new List<Payment>();
        for (var i = 0; i < requests.Count; i++)
            payments.Add(await SettleOneAsync(requests[i], new IdempotencyKey($"{saleKey}:{i}"), ct));
        return payments;
    }

    private Task<Payment> SettleOneAsync(PaymentRequest request, IdempotencyKey key, CancellationToken ct) =>
        request.Method switch
        {
            PaymentMethod.Card => ChargeCardAsync(request, key, ct),
            PaymentMethod.GiftCertificate => RedeemCertificateAsync(request, ct),
            _ => Task.FromResult(new Payment(request.Method, request.Amount, PaymentStatus.Captured, request.Tendered)),
        };

    private async Task<Payment> ChargeCardAsync(PaymentRequest request, IdempotencyKey key, CancellationToken ct)
    {
        var status = await gateway.ChargeCardAsync(request.Amount, key, ct) switch
        {
            CardPaymentOutcome.Captured => PaymentStatus.Captured,
            CardPaymentOutcome.Pending => PaymentStatus.Pending,
            _ => throw new PaymentDeclinedException(),
        };
        return new Payment(PaymentMethod.Card, request.Amount, status);
    }

    private async Task<Payment> RedeemCertificateAsync(PaymentRequest request, CancellationToken ct)
    {
        var number = Guard.NotBlank(request.GiftCertificateNumber);
        var certificate = await certificates.FindByNumberAsync(number, ct).OrNotFound("Gift certificate");
        certificate.Redeem(request.Amount);
        return new Payment(PaymentMethod.GiftCertificate, request.Amount, PaymentStatus.Captured);
    }
}
