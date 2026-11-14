namespace Application.Catalog;

public interface ICatalogCache
{
    Task<BookDetails?> GetAsync(BookId book, CancellationToken ct);

    Task SetAsync(BookDetails details, CancellationToken ct);

    Task InvalidateAsync(BookId book, CancellationToken ct);
}
