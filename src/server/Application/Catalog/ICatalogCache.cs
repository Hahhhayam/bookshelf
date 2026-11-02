namespace Application.Catalog;

public interface ICatalogCache
{
    Task InvalidateAsync(BookId book, CancellationToken ct);
}
