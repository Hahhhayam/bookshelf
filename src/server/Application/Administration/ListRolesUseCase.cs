namespace Application.Administration;

public sealed class ListRolesUseCase(IAdministrationQueries queries, ICurrentUser user)
{
    public Task<IReadOnlyList<Role>> ExecuteAsync(CancellationToken ct)
    {
        user.Require(Permissions.UsersManage);
        return queries.RolesAsync(ct);
    }
}
