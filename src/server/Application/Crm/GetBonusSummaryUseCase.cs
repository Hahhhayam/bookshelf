namespace Application.Crm;

/// <summary>
/// FR-14 for the buyer in the online shop. Customers have no login, so the shop asks by the customer id it acts for;
/// that is why only the tier and bonuses are returned, never contacts or purchases.
/// </summary>
public sealed class GetBonusSummaryUseCase(ICustomerRepository customers, IBonusAccountRepository accounts)
{
    public async Task<BonusSummary> ExecuteAsync(CustomerId id, CancellationToken ct)
    {
        var customer = await customers.GetAsync(id, ct).OrNotFound("Customer");
        return new BonusSummary(customer.Tier, await accounts.FindByCustomerAsync(id, ct));
    }
}
