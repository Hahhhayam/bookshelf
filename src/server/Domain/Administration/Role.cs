namespace Domain.Administration;

/// <summary>A named set of permissions (RBAC), such as cashier or warehouse keeper.</summary>
public sealed class Role : AggregateRoot<RoleId>
{
    private readonly HashSet<Permission> _permissions = [];

    public string Name { get; private set; }
    public IReadOnlyCollection<Permission> Permissions => _permissions;

    private Role(RoleId id, string name) : base(id) => Name = name;

    public static Role Create(string name, IEnumerable<Permission> permissions)
    {
        var role = new Role(RoleId.New(), Guard.NotBlank(name));
        role._permissions.UnionWith(permissions);
        return role;
    }

    public void Rename(string name) => Name = Guard.NotBlank(name);

    public void Grant(Permission permission) => _permissions.Add(permission);

    public void Revoke(Permission permission) => _permissions.Remove(permission);

    public bool Has(Permission permission) => _permissions.Contains(permission);
}
