namespace Application.Catalog;

public interface IScheduledPriceRepository
{
    Task<ScheduledPrice?> FindAsync(BookId book, CancellationToken ct);

    Task<IReadOnlyList<ScheduledPrice>> ListDueAsync(DateTimeOffset now, CancellationToken ct);

    void Add(ScheduledPrice price);

    void Remove(ScheduledPrice price);
}
