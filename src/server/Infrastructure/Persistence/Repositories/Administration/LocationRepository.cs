using Application.Administration;

namespace Infrastructure.Persistence.Repositories.Administration;

internal sealed class LocationRepository(BookstoreDbContext db) : ILocationRepository
{
    public Task<Location?> GetAsync(LocationId id, CancellationToken ct) =>
        db.Set<Location>().FirstOrDefaultAsync(l => l.Id == id, ct);

    public void Add(Location location) => db.Set<Location>().Add(location);
}
