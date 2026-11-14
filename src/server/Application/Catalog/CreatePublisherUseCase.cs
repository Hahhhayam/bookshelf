namespace Application.Catalog;

public sealed class CreatePublisherUseCase(IPublisherRepository publishers, ICurrentUser user, IUnitOfWork unitOfWork)
{
    public async Task<PublisherId> ExecuteAsync(string name, CancellationToken ct)
    {
        user.Require(Permissions.CatalogEdit);
        var publisher = Publisher.Create(name);
        publishers.Add(publisher);
        await unitOfWork.CommitAsync(ct);
        return publisher.Id;
    }
}
