using Application.Administration;

namespace Infrastructure.Persistence.Queries.Administration;

internal sealed class UserProfileQuery(BookstoreDbContext db) : IUserProfileQuery
{
    public async Task<UserProfile?> FindAsync(UserId user, CancellationToken ct)
    {
        var found = await db.Set<User>().AsNoTracking().FirstOrDefaultAsync(u => u.Id == user, ct);
        if (found is null)
            return null;
        return new UserProfile(found.Id, found.Login, await PermissionsAsync(found, ct), await LocationsAsync(found, ct));
    }

    private async Task<List<string>> PermissionsAsync(User user, CancellationToken ct)
    {
        var roleIds = user.Roles.ToList();
        var roles = await db.Set<Role>().AsNoTracking().Where(r => roleIds.Contains(r.Id)).ToListAsync(ct);
        return roles.SelectMany(r => r.Permissions).Select(p => p.Code).Distinct().Order().ToList();
    }

    private async Task<List<ProfileLocation>> LocationsAsync(User user, CancellationToken ct)
    {
        var allowed = user.Access.Locations.ToList();
        var locations = await db.Set<Location>().AsNoTracking()
            .Where(l => allowed.Contains(l.Id) && l.IsActive)
            .ToListAsync(ct);
        return locations.OrderBy(l => l.Name).Select(l => new ProfileLocation(l.Id, l.Name, l.Type)).ToList();
    }
}
