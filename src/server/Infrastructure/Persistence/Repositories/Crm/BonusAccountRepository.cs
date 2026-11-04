using Application.Crm;
using Domain.Crm;

namespace Infrastructure.Persistence.Repositories.Crm;

internal sealed class BonusAccountRepository(BookstoreDbContext db) : IBonusAccountRepository
{
    public Task<BonusAccount?> FindByCustomerAsync(CustomerId customer, CancellationToken ct) =>
        db.Set<BonusAccount>().FirstOrDefaultAsync(a => a.CustomerId == customer, ct);

    public void Add(BonusAccount account) => db.Set<BonusAccount>().Add(account);
}
