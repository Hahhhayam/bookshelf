namespace Application.Administration;

public interface IAuditRecordRepository
{
    void Add(AuditRecord record);
}
