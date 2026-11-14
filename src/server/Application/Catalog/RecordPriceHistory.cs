namespace Application.Catalog;

/// <summary>Keeps the price history in step with the book. Events are delivered at least once, so a seen event is skipped.</summary>
public sealed class RecordPriceHistory(IPriceHistoryRepository history, IUnitOfWork unitOfWork)
    : IEventHandler<BookAdded>, IEventHandler<PriceChanged>
{
    public Task HandleAsync(BookAdded domainEvent, CancellationToken ct) =>
        RecordAsync(domainEvent.EventId, domainEvent.BookId, domainEvent.InitialPrice, domainEvent.OccurredAt, domainEvent.CreatedBy, ct);

    public Task HandleAsync(PriceChanged domainEvent, CancellationToken ct) =>
        RecordAsync(domainEvent.EventId, domainEvent.BookId, domainEvent.NewPrice, domainEvent.OccurredAt, domainEvent.ChangedBy, ct);

    private async Task RecordAsync(
        Guid eventId, BookId book, Money price, DateTimeOffset at, UserId setBy, CancellationToken ct)
    {
        if (await history.ExistsAsync(eventId, ct))
            return;

        history.Add(PriceEntry.Record(eventId, book, price, at, setBy));
        await unitOfWork.CommitAsync(ct);
    }
}
