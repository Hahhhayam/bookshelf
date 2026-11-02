namespace Application.Catalog;

public interface IBookRepository
{
    Task<Book?> GetAsync(BookId id, CancellationToken ct);

    Task<bool> IsIsbnTakenAsync(Isbn isbn, CancellationToken ct);

    void Add(Book book);

    void Remove(Book book);
}
