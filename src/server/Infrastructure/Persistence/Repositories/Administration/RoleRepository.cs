using Application.Administration;

namespace Infrastructure.Persistence.Repositories.Administration;

internal sealed class RoleRepository(BookstoreDbContext db) : IRoleRepository
{
    public Task<Role?> GetAsync(RoleId id, CancellationToken ct) =>
        db.Set<Role>().FirstOrDefaultAsync(r => r.Id == id, ct);

    public void Add(Role role) => db.Set<Role>().Add(role);
}
