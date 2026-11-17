namespace Application.Administration;

public sealed class CreateRoleUseCase(IRoleRepository roles, ICurrentUser user, AuditTrail audit, IUnitOfWork unitOfWork)
{
    public async Task<RoleId> ExecuteAsync(string name, IReadOnlySet<Permission> permissions, CancellationToken ct)
    {
        user.Require(Permissions.UsersManage);
        var role = Role.Create(name, permissions);
        roles.Add(role);
        audit.Record("role.created", role.Id.ToString(),
            FieldChange.Set("name", role.Name), FieldChange.Set("permissions", RoleText.Of(role)));
        await unitOfWork.CommitAsync(ct);
        return role.Id;
    }
}
