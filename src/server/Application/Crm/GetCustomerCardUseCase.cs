namespace Application.Crm;

/// <summary>
/// Personal data, so only roles that serve or manage customers may see it. Cashiers look a customer up by the card
/// they scan at the till.
/// </summary>
public sealed class GetCustomerCardUseCase(ICustomerQueries customers, ICurrentUser user)
{
    public Task<CustomerCardView> ExecuteAsync(CustomerId customer, CancellationToken ct)
    {
        user.RequireAny(Permissions.CrmManage, Permissions.SalesCreate);
        return customers.FindAsync(customer, ct).OrNotFound("Customer");
    }

    public Task<CustomerCardView> ExecuteAsync(CustomerCard card, CancellationToken ct)
    {
        user.RequireAny(Permissions.CrmManage, Permissions.SalesCreate);
        return customers.FindByCardAsync(card, ct).OrNotFound("Customer");
    }
}
