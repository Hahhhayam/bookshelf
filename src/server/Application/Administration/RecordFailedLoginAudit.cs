namespace Application.Administration;

public sealed class RecordFailedLoginAudit(IAuditRecordRepository records, IUnitOfWork unitOfWork)
    : IEventHandler<LoginFailed>
{
    public async Task HandleAsync(LoginFailed domainEvent, CancellationToken ct)
    {
        records.Add(AuditRecord.Record(domainEvent.UserId, domainEvent.OccurredAt, "login.failed",
            domainEvent.Login, after: domainEvent.Reason.ToString()));
        await unitOfWork.CommitAsync(ct);
    }
}
