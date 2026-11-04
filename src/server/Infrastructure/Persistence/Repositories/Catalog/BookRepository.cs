using Application.Catalog;
using Domain.Catalog;

namespace Infrastructure.Persistence.Repositories.Catalog;

internal sealed class BookRepository(BookstoreDbContext db) : IBookRepository
{
    public Task<Book?> GetAsync(BookId id, CancellationToken ct) =>
        db.Set<Book>().FirstOrDefaultAsync(b => b.Id == id, ct);

    public Task<bool> IsIsbnTakenAsync(Isbn isbn, CancellationToken ct) =>
        db.Set<Book>().AnyAsync(b => b.Isbn == isbn, ct);

    public void Add(Book book) => db.Set<Book>().Add(book);

    public void Remove(Book book) => db.Set<Book>().Remove(book);
}
