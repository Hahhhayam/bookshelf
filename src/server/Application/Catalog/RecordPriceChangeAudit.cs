namespace Application.Catalog;

public sealed class RecordPriceChangeAudit(IAuditRecordRepository records) : IEventHandler<PriceChanged>
{
    public Task HandleAsync(PriceChanged domainEvent, CancellationToken ct)
    {
        records.Add(AuditRecord.Record(domainEvent.ChangedBy, domainEvent.OccurredAt, "book.price-changed",
            domainEvent.BookId.ToString(),
            new FieldChange("price", domainEvent.OldPrice.ToString(), domainEvent.NewPrice.ToString())));
        return Task.CompletedTask;
    }
}
