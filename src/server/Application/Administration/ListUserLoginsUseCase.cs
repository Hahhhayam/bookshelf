namespace Application.Administration;

/// <summary>
/// Every employee sees who changed the documents they work with (scenario 3.11), so naming users needs no
/// permission; only logins are given, nothing about access.
/// </summary>
public sealed class ListUserLoginsUseCase(IAdministrationQueries queries)
{
    public Task<IReadOnlyList<UserLogin>> ExecuteAsync(CancellationToken ct) => queries.LoginsAsync(ct);
}
