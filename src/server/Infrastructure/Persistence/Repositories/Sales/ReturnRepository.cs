using Application.Sales;
using Domain.Sales;

namespace Infrastructure.Persistence.Repositories.Sales;

internal sealed class ReturnRepository(BookstoreDbContext db) : IReturnRepository
{
    public Task<Return?> GetAsync(ReturnId id, CancellationToken ct) =>
        db.Set<Return>().FirstOrDefaultAsync(r => r.Id == id, ct);

    public async Task<IReadOnlyDictionary<BookId, Quantity>> ReturnedQuantitiesAsync(SaleId sale, CancellationToken ct)
    {
        var lines = await db.Set<Return>()
            .AsNoTracking()
            .Where(r => r.SaleId == sale)
            .SelectMany(r => r.Lines)
            .Select(l => new { Book = l.Id, l.Quantity })
            .ToListAsync(ct);

        return lines
            .GroupBy(l => l.Book)
            .ToDictionary(g => g.Key, g => new Quantity(g.Sum(l => l.Quantity.Value)));
    }

    public void Add(Return ret) => db.Set<Return>().Add(ret);
}
