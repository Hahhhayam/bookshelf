using Application.Crm;
using Domain.Crm;

namespace Infrastructure.Persistence.Repositories.Crm;

internal sealed class PromotionRepository(BookstoreDbContext db) : IPromotionRepository
{
    public async Task<IReadOnlyList<Promotion>> ListActiveAsync(DateTimeOffset at, CancellationToken ct) =>
        await db.Set<Promotion>()
            .Where(p => p.Period.Start <= at && at < p.Period.End)
            .ToListAsync(ct);

    public void Add(Promotion promotion) => db.Set<Promotion>().Add(promotion);
}
