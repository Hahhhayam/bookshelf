namespace Application.Catalog;

public sealed class RenamePublisherUseCase(IPublisherRepository publishers, ICurrentUser user, IUnitOfWork unitOfWork)
{
    public async Task ExecuteAsync(PublisherId id, string name, CancellationToken ct)
    {
        user.Require(Permissions.CatalogEdit);
        var publisher = await publishers.GetAsync(id, ct).OrNotFound("Publisher");
        publisher.Rename(name);
        await unitOfWork.CommitAsync(ct);
    }
}
