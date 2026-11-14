namespace Application.Administration;

public interface IRoleRepository
{
    Task<Role?> GetAsync(RoleId id, CancellationToken ct);

    void Add(Role role);
}
