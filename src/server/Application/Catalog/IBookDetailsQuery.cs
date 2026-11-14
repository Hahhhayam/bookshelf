namespace Application.Catalog;

public interface IBookDetailsQuery
{
    Task<BookDetails?> FindAsync(BookId book, CancellationToken ct);

    Task<IReadOnlyList<LocationAvailability>> AvailabilityAsync(BookId book, CancellationToken ct);
}
