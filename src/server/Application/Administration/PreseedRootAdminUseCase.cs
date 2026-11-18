namespace Application.Administration;

/// <summary>
/// Runs at startup. A fresh database has no users, and only a user with users.manage can add staff, so a "root"
/// account (password "root") with every permission and access to every location, present and future, is created whenever
/// no user has that login. An older root with no locations at all is widened the same way.
/// </summary>
public sealed class PreseedRootAdminUseCase(
    IUserRepository users, IRoleRepository roles, IPasswordHasher hasher, IUnitOfWork unitOfWork)
{
    public const string Login = "root";

    public async Task ExecuteAsync(CancellationToken ct)
    {
        if (await users.FindByLoginAsync(Login, ct) is { } existing)
        {
            await WidenAccessAsync(existing, ct);
            return;
        }

        var role = Role.Create(Login, Permissions.All.Select(code => (Permission)code));
        roles.Add(role);
        users.Add(User.Create(Login, hasher.Hash(Login), LocationAccess.All, [role.Id]));
        await unitOfWork.CommitAsync(ct);
    }

    private async Task WidenAccessAsync(User root, CancellationToken ct)
    {
        if (root.Access is not { Everywhere: false, Locations.Count: 0 })
            return;
        root.ChangeAccess(LocationAccess.All);
        await unitOfWork.CommitAsync(ct);
    }
}
