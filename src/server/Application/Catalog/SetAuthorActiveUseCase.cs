namespace Application.Catalog;

/// <summary>Reference data is deactivated instead of deleted, so books keep pointing at it.</summary>
public sealed class SetAuthorActiveUseCase(
    IAuthorRepository authors, ICurrentUser user, AuditTrail audit, IUnitOfWork unitOfWork)
{
    public async Task ExecuteAsync(AuthorId id, bool active, CancellationToken ct)
    {
        user.Require(Permissions.CatalogEdit);
        var author = await authors.GetAsync(id, ct).OrNotFound("Author");
        if (active)
            author.Activate();
        else
            author.Deactivate();
        audit.Record(active ? "author.activated" : "author.deactivated", id.ToString(), after: author.Name);
        await unitOfWork.CommitAsync(ct);
    }
}
