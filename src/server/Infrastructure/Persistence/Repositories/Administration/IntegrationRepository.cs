using Application.Administration;

namespace Infrastructure.Persistence.Repositories.Administration;

internal sealed class IntegrationRepository(BookstoreDbContext db) : IIntegrationRepository
{
    public Task<Integration?> GetAsync(IntegrationId id, CancellationToken ct) =>
        db.Set<Integration>().FirstOrDefaultAsync(i => i.Id == id, ct);
}
