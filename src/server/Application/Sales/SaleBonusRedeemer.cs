namespace Application.Sales;

/// <summary>Spends the customer's bonuses for the Bonus payments of a sale. It needs the sale id, so it runs after the sale exists.</summary>
public sealed class SaleBonusRedeemer(IBonusAccountRepository accounts, IBonusPolicy policy)
{
    public async Task RedeemAsync(Sale sale, DateTimeOffset now, CancellationToken ct)
    {
        var bonusPayments = sale.Payments.Where(p => p.Method == PaymentMethod.Bonus).ToList();
        if (bonusPayments.Count == 0)
            return;

        var customer = sale.CustomerId ?? throw new DomainException("customer-required", "Bonuses can be spent only by an identified customer.");
        var account = await accounts.FindByCustomerAsync(customer, ct).OrNotFound("Bonus account");
        foreach (var payment in bonusPayments)
            account.Redeem(policy.PointsFor(payment.Amount), sale.Id, now);
    }

    /// <summary>The balance can pay at most the whole receipt.</summary>
    public async Task<BonusWriteOff> WriteOffAsync(CustomerId customer, Money total, CancellationToken ct)
    {
        var balance = (await accounts.FindByCustomerAsync(customer, ct))?.Balance.Points ?? 0;
        var worth = policy.ValueOf(balance, total.Currency);
        return new BonusWriteOff(balance, worth < total ? worth : total);
    }
}
