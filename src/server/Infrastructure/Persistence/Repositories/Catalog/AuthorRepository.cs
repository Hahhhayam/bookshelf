using Application.Catalog;

namespace Infrastructure.Persistence.Repositories.Catalog;

internal sealed class AuthorRepository(BookstoreDbContext db) : IAuthorRepository
{
    public Task<Author?> GetAsync(AuthorId id, CancellationToken ct) =>
        db.Set<Author>().FirstOrDefaultAsync(a => a.Id == id, ct);

    public void Add(Author author) => db.Set<Author>().Add(author);
}
