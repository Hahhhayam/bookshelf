namespace Application.Catalog;

public interface IBookDetailsQuery
{
    Task<BookDetails?> FindAsync(BookId book, CancellationToken ct);

    Task<IReadOnlyList<LocationAvailability>> AvailabilityAsync(BookId book, CancellationToken ct);

    Task<ScheduledPrice?> ScheduledPriceAsync(BookId book, CancellationToken ct);

    /// <summary>Oldest first.</summary>
    Task<IReadOnlyList<PriceEntry>> PriceHistoryAsync(BookId book, CancellationToken ct);
}
