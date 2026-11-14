namespace Application.Crm;

public sealed class ReverseBonusesOnReturnConfirmed(
    ICustomerRepository customers, IBonusAccountRepository accounts, IBonusPolicy policy)
    : IEventHandler<ReturnConfirmed>
{
    public async Task HandleAsync(ReturnConfirmed domainEvent, CancellationToken ct)
    {
        if (domainEvent.CustomerId is not { } customerId)
            return;
        var account = await accounts.FindByCustomerAsync(customerId, ct);
        if (account is null)
            return;

        var customer = await customers.GetAsync(customerId, ct).OrNotFound("Customer");
        var points = policy.AccrualFor(domainEvent.RefundTotal, customer.Tier);
        if (points > 0)
            account.Reverse(points, domainEvent.ReturnId, domainEvent.OccurredAt);
    }
}
