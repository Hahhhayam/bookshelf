namespace Application.Catalog;

public interface IPublisherRepository
{
    Task<Publisher?> GetAsync(PublisherId id, CancellationToken ct);

    void Add(Publisher publisher);
}
