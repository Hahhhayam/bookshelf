namespace Application.Catalog;

public sealed class RecordPriceChangeAudit(IAuditRecordRepository records, IUnitOfWork unitOfWork)
    : IEventHandler<PriceChanged>
{
    public async Task HandleAsync(PriceChanged domainEvent, CancellationToken ct)
    {
        records.Add(AuditRecord.Record(domainEvent.ChangedBy, domainEvent.OccurredAt, "book.price-changed",
            domainEvent.BookId.ToString(), domainEvent.OldPrice.ToString(), domainEvent.NewPrice.ToString()));
        await unitOfWork.CommitAsync(ct);
    }
}
