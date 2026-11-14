namespace Application.Catalog;

public sealed class CreateCategoryUseCase(ICategoryRepository categories, ICurrentUser user, IUnitOfWork unitOfWork)
{
    public async Task<CategoryId> ExecuteAsync(string name, CancellationToken ct)
    {
        user.Require(Permissions.CatalogEdit);
        var category = Category.Create(name);
        categories.Add(category);
        await unitOfWork.CommitAsync(ct);
        return category.Id;
    }
}
