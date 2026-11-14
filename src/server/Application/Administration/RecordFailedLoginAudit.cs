namespace Application.Administration;

public sealed class RecordFailedLoginAudit(IAuditRecordRepository records) : IEventHandler<LoginFailed>
{
    public Task HandleAsync(LoginFailed domainEvent, CancellationToken ct)
    {
        records.Add(AuditRecord.Record(domainEvent.UserId, domainEvent.OccurredAt, "login.failed",
            domainEvent.Login, after: domainEvent.Reason.ToString()));
        return Task.CompletedTask;
    }
}
