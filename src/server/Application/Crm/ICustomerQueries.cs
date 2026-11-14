namespace Application.Crm;

public interface ICustomerQueries
{
    Task<CustomerCardView?> FindAsync(CustomerId customer, CancellationToken ct);

    Task<CustomerCardView?> FindByCardAsync(CustomerCard card, CancellationToken ct);
}
