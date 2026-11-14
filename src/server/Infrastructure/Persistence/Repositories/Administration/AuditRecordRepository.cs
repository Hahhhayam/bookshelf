using Application.Administration;

namespace Infrastructure.Persistence.Repositories.Administration;

internal sealed class AuditRecordRepository(BookstoreDbContext db) : IAuditRecordRepository
{
    public void Add(AuditRecord record) => db.Set<AuditRecord>().Add(record);
}
