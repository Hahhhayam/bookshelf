namespace Application.Inventory;

public sealed class RecordTransferStatusHistory(ITransferStatusHistoryRepository history)
    : IEventHandler<TransferStatusChanged>
{
    public Task HandleAsync(TransferStatusChanged domainEvent, CancellationToken ct)
    {
        history.Add(TransferStatusChange.Record(domainEvent));
        return Task.CompletedTask;
    }
}
