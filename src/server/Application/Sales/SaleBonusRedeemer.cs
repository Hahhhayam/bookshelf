namespace Application.Sales;

/// <summary>Spends the customer's bonuses for the Bonus payments of a sale. It needs the sale id, so it runs after the sale exists.</summary>
public sealed class SaleBonusRedeemer(IBonusAccountRepository accounts, IBonusPolicy policy)
{
    public async Task RedeemAsync(Sale sale, DateTimeOffset now, CancellationToken ct)
    {
        var bonusPayments = sale.Payments.Where(p => p.Method == PaymentMethod.Bonus).ToList();
        if (bonusPayments.Count == 0)
            return;

        var customer = sale.CustomerId ?? throw new DomainException("Bonuses can be spent only by an identified customer.");
        var account = await accounts.FindByCustomerAsync(customer, ct).OrNotFound("Bonus account");
        foreach (var payment in bonusPayments)
            account.Redeem(policy.PointsFor(payment.Amount), sale.Id, now);
    }
}
