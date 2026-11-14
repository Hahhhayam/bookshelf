using Application.Catalog;

namespace Infrastructure.Persistence.Repositories.Catalog;

internal sealed class PublisherRepository(BookstoreDbContext db) : IPublisherRepository
{
    public Task<Publisher?> GetAsync(PublisherId id, CancellationToken ct) =>
        db.Set<Publisher>().FirstOrDefaultAsync(p => p.Id == id, ct);

    public void Add(Publisher publisher) => db.Set<Publisher>().Add(publisher);
}
