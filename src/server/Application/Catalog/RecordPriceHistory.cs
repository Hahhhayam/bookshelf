namespace Application.Catalog;

/// <summary>Keeps the price history in step with the book.</summary>
public sealed class RecordPriceHistory(IPriceHistoryRepository history)
    : IEventHandler<BookAdded>, IEventHandler<PriceChanged>
{
    public Task HandleAsync(BookAdded domainEvent, CancellationToken ct) =>
        RecordAsync(domainEvent.EventId, domainEvent.BookId, domainEvent.InitialPrice, domainEvent.OccurredAt, domainEvent.CreatedBy);

    public Task HandleAsync(PriceChanged domainEvent, CancellationToken ct) =>
        RecordAsync(domainEvent.EventId, domainEvent.BookId, domainEvent.NewPrice, domainEvent.OccurredAt, domainEvent.ChangedBy);

    private Task RecordAsync(Guid eventId, BookId book, Money price, DateTimeOffset at, UserId setBy)
    {
        history.Add(PriceEntry.Record(eventId, book, price, at, setBy));
        return Task.CompletedTask;
    }
}
