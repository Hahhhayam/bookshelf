namespace Application.Sales;

/// <summary>
/// Adapter for the external card payment service. Timeouts and retries are handled inside it;
/// a service that stays unavailable is reported as Pending so the till keeps working.
/// </summary>
public interface IPaymentGateway
{
    /// <param name="key">Makes a repeated charge for the same operation safe.</param>
    Task<CardPaymentOutcome> ChargeCardAsync(Money amount, IdempotencyKey key, CancellationToken ct);
}
