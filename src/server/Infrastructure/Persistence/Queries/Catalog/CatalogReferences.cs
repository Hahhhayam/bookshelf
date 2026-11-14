using Application.Catalog;

namespace Infrastructure.Persistence.Queries.Catalog;

internal sealed class CatalogReferences(BookstoreDbContext db) : ICatalogReferences
{
    public async Task<bool> AllAuthorsExistAsync(IEnumerable<AuthorId> authors, CancellationToken ct)
    {
        var wanted = authors.Distinct().ToList();
        var found = await db.Set<Author>().CountAsync(a => wanted.Contains(a.Id), ct);
        return found == wanted.Count;
    }

    public Task<bool> PublisherExistsAsync(PublisherId publisher, CancellationToken ct) =>
        db.Set<Publisher>().AnyAsync(p => p.Id == publisher, ct);

    public Task<bool> CategoryExistsAsync(CategoryId category, CancellationToken ct) =>
        db.Set<Category>().AnyAsync(c => c.Id == category, ct);
}
