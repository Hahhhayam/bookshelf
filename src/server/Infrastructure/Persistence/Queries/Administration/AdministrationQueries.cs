using Application.Administration;

namespace Infrastructure.Persistence.Queries.Administration;

internal sealed class AdministrationQueries(BookstoreDbContext db) : IAdministrationQueries
{
    public async Task<IReadOnlyList<User>> UsersAsync(CancellationToken ct) =>
        await db.Set<User>().AsNoTracking().OrderBy(u => u.Login).ToListAsync(ct);

    public async Task<IReadOnlyList<UserLogin>> LoginsAsync(CancellationToken ct) =>
        await db.Set<User>().AsNoTracking().OrderBy(u => u.Login)
            .Select(u => new UserLogin(u.Id, u.Login)).ToListAsync(ct);

    public async Task<IReadOnlyList<Role>> RolesAsync(CancellationToken ct) =>
        await db.Set<Role>().AsNoTracking().OrderBy(r => r.Name).ToListAsync(ct);

    public async Task<IReadOnlyList<Location>> LocationsAsync(CancellationToken ct) =>
        await db.Set<Location>().AsNoTracking().OrderBy(l => l.Name).ToListAsync(ct);

    public async Task<IReadOnlyList<Integration>> IntegrationsAsync(CancellationToken ct) =>
        await db.Set<Integration>().AsNoTracking().OrderBy(i => i.Name).ToListAsync(ct);
}
