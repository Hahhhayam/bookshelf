namespace Application.Catalog;

public sealed class RenameAuthorUseCase(IAuthorRepository authors, ICurrentUser user, IUnitOfWork unitOfWork)
{
    public async Task ExecuteAsync(AuthorId id, string name, CancellationToken ct)
    {
        user.Require(Permissions.CatalogEdit);
        var author = await authors.GetAsync(id, ct).OrNotFound("Author");
        author.Rename(name);
        await unitOfWork.CommitAsync(ct);
    }
}
