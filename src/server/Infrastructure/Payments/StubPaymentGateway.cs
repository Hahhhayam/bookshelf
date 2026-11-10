using Application.Sales;

namespace Infrastructure.Payments;

/// <summary>Stand-in for the card processor: every charge is captured. Replace before real payments.</summary>
internal sealed class StubPaymentGateway : IPaymentGateway
{
    public Task<CardPaymentOutcome> ChargeCardAsync(Money amount, IdempotencyKey key, CancellationToken ct) =>
        Task.FromResult(CardPaymentOutcome.Captured);
}
