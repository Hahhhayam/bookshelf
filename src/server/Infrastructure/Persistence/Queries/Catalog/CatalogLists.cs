using Application.Catalog;

namespace Infrastructure.Persistence.Queries.Catalog;

internal sealed class CatalogLists(BookstoreDbContext db) : ICatalogLists
{
    public async Task<IReadOnlyList<Author>> AuthorsAsync(CancellationToken ct) =>
        await db.Set<Author>().AsNoTracking().OrderBy(a => a.Name).ToListAsync(ct);

    public async Task<IReadOnlyList<Publisher>> PublishersAsync(CancellationToken ct) =>
        await db.Set<Publisher>().AsNoTracking().OrderBy(p => p.Name).ToListAsync(ct);

    public async Task<IReadOnlyList<Category>> CategoriesAsync(CancellationToken ct) =>
        await db.Set<Category>().AsNoTracking().OrderBy(c => c.Name).ToListAsync(ct);
}
