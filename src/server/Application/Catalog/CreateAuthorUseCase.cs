namespace Application.Catalog;

public sealed class CreateAuthorUseCase(IAuthorRepository authors, ICurrentUser user, IUnitOfWork unitOfWork)
{
    public async Task<AuthorId> ExecuteAsync(string name, CancellationToken ct)
    {
        user.Require(Permissions.CatalogEdit);
        var author = Author.Create(name);
        authors.Add(author);
        await unitOfWork.CommitAsync(ct);
        return author.Id;
    }
}
