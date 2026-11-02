namespace Application.Crm;

public interface ICustomerRepository
{
    Task<Customer?> GetAsync(CustomerId id, CancellationToken ct);

    Task<Customer?> FindByCardAsync(CustomerCard card, CancellationToken ct);

    void Add(Customer customer);
}
