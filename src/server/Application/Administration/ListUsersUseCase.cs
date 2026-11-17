namespace Application.Administration;

public sealed class ListUsersUseCase(IAdministrationQueries queries, ICurrentUser user)
{
    public Task<IReadOnlyList<User>> ExecuteAsync(CancellationToken ct)
    {
        user.Require(Permissions.UsersManage);
        return queries.UsersAsync(ct);
    }
}
