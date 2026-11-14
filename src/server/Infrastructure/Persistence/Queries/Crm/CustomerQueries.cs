using Application.Crm;

namespace Infrastructure.Persistence.Queries.Crm;

internal sealed class CustomerQueries(BookstoreDbContext db) : ICustomerQueries
{
    public async Task<CustomerCardView?> FindAsync(CustomerId customer, CancellationToken ct) =>
        await CardOfAsync(await db.Set<Customer>().AsNoTracking().FirstOrDefaultAsync(c => c.Id == customer, ct), ct);

    public async Task<CustomerCardView?> FindByCardAsync(CustomerCard card, CancellationToken ct) =>
        await CardOfAsync(await db.Set<Customer>().AsNoTracking().FirstOrDefaultAsync(c => c.Card == card, ct), ct);

    private async Task<CustomerCardView?> CardOfAsync(Customer? customer, CancellationToken ct)
    {
        if (customer is null)
            return null;
        var bonuses = await db.Set<BonusAccount>().AsNoTracking()
            .FirstOrDefaultAsync(a => a.CustomerId == customer.Id, ct);
        var purchases = await db.Set<Sale>().AsNoTracking()
            .Where(s => s.CustomerId == customer.Id)
            .OrderByDescending(s => s.CompletedAt)
            .Select(s => new PurchaseSummary(s.Id, s.LocationId, s.CompletedAt, s.Total, s.Status))
            .ToListAsync(ct);
        return new CustomerCardView(customer, bonuses, purchases);
    }
}
