using Application.Catalog;

namespace Infrastructure.Persistence.Repositories.Catalog;

internal sealed class CategoryRepository(BookstoreDbContext db) : ICategoryRepository
{
    public Task<Category?> GetAsync(CategoryId id, CancellationToken ct) =>
        db.Set<Category>().FirstOrDefaultAsync(c => c.Id == id, ct);

    public void Add(Category category) => db.Set<Category>().Add(category);
}
