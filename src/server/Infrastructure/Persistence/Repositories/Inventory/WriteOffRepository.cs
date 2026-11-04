using Application.Inventory;
using Domain.Inventory;

namespace Infrastructure.Persistence.Repositories.Inventory;

internal sealed class WriteOffRepository(BookstoreDbContext db) : IWriteOffRepository
{
    public void Add(WriteOff writeOff) => db.Set<WriteOff>().Add(writeOff);
}
