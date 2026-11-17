namespace Application.Administration;

/// <summary>
/// Runs at startup. A fresh database has no users, and only a user with users.manage can add staff, so a "root"
/// account (password "root") with every permission is created whenever no user has that login.
/// </summary>
public sealed class PreseedRootAdminUseCase(
    IUserRepository users, IRoleRepository roles, IPasswordHasher hasher, IUnitOfWork unitOfWork)
{
    public const string Login = "root";

    public async Task ExecuteAsync(CancellationToken ct)
    {
        if (await users.FindByLoginAsync(Login, ct) is not null)
            return;

        var role = Role.Create(Login, Permissions.All.Select(code => (Permission)code));
        roles.Add(role);
        users.Add(User.Create(Login, hasher.Hash(Login), new LocationAccess(new HashSet<LocationId>()), [role.Id]));
        await unitOfWork.CommitAsync(ct);
    }
}
