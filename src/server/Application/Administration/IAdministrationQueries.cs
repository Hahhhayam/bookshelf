namespace Application.Administration;

/// <summary>The administration lists; each is ordered by name.</summary>
public interface IAdministrationQueries
{
    Task<IReadOnlyList<User>> UsersAsync(CancellationToken ct);

    Task<IReadOnlyList<UserLogin>> LoginsAsync(CancellationToken ct);

    Task<IReadOnlyList<Role>> RolesAsync(CancellationToken ct);

    /// <summary>Inactive locations included, so old documents still show theirs.</summary>
    Task<IReadOnlyList<Location>> LocationsAsync(CancellationToken ct);

    Task<IReadOnlyList<Integration>> IntegrationsAsync(CancellationToken ct);
}
