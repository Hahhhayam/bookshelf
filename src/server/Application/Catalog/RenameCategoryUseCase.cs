namespace Application.Catalog;

public sealed class RenameCategoryUseCase(ICategoryRepository categories, ICurrentUser user, IUnitOfWork unitOfWork)
{
    public async Task ExecuteAsync(CategoryId id, string name, CancellationToken ct)
    {
        user.Require(Permissions.CatalogEdit);
        var category = await categories.GetAsync(id, ct).OrNotFound("Category");
        category.Rename(name);
        await unitOfWork.CommitAsync(ct);
    }
}
