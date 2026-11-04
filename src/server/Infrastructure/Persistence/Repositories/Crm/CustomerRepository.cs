using Application.Crm;
using Domain.Crm;

namespace Infrastructure.Persistence.Repositories.Crm;

internal sealed class CustomerRepository(BookstoreDbContext db) : ICustomerRepository
{
    public Task<Customer?> GetAsync(CustomerId id, CancellationToken ct) =>
        db.Set<Customer>().FirstOrDefaultAsync(c => c.Id == id, ct);

    public Task<Customer?> FindByCardAsync(CustomerCard card, CancellationToken ct) =>
        db.Set<Customer>().FirstOrDefaultAsync(c => c.Card == card, ct);

    public void Add(Customer customer) => db.Set<Customer>().Add(customer);
}
