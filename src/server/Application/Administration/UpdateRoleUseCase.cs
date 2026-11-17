namespace Application.Administration;

/// <summary>An access rights change, so it is audited with the permissions before and after (NFR Audit).</summary>
public sealed class UpdateRoleUseCase(IRoleRepository roles, ICurrentUser user, AuditTrail audit, IUnitOfWork unitOfWork)
{
    public async Task ExecuteAsync(RoleId id, string name, IReadOnlySet<Permission> permissions, CancellationToken ct)
    {
        user.Require(Permissions.UsersManage);
        var role = await roles.GetAsync(id, ct).OrNotFound("Role");

        var (oldName, oldPermissions) = (role.Name, RoleText.Of(role));
        role.Rename(name);
        role.ChangePermissions(permissions);
        audit.Record("role.changed", id.ToString(), new FieldChange("name", oldName, role.Name),
            new FieldChange("permissions", oldPermissions, RoleText.Of(role)));
        await unitOfWork.CommitAsync(ct);
    }
}
