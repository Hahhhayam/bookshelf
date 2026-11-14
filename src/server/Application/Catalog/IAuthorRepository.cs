namespace Application.Catalog;

public interface IAuthorRepository
{
    Task<Author?> GetAsync(AuthorId id, CancellationToken ct);

    void Add(Author author);
}
