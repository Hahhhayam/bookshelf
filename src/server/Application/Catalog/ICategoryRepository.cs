namespace Application.Catalog;

public interface ICategoryRepository
{
    Task<Category?> GetAsync(CategoryId id, CancellationToken ct);

    void Add(Category category);
}
