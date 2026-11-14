namespace Application.Crm;

public sealed class AccrueBonusesOnSaleCompleted(
    ICustomerRepository customers, IBonusAccountRepository accounts, IBonusPolicy policy)
    : IEventHandler<SaleCompleted>
{
    public async Task HandleAsync(SaleCompleted domainEvent, CancellationToken ct)
    {
        if (domainEvent.CustomerId is not { } customerId)
            return;

        var customer = await customers.GetAsync(customerId, ct).OrNotFound("Customer");
        var account = await accounts.FindByCustomerAsync(customerId, ct) ?? OpenAccount(customerId);
        var points = policy.AccrualFor(domainEvent.Total, customer.Tier);
        if (points > 0)
            account.Accrue(points, domainEvent.SaleId, domainEvent.OccurredAt);
    }

    private BonusAccount OpenAccount(CustomerId customer)
    {
        var account = BonusAccount.Open(customer);
        accounts.Add(account);
        return account;
    }
}
