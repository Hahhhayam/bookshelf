namespace Application.Administration;

public sealed record ChangeUserAccessCommand(UserId User, IReadOnlyList<RoleId> Roles, IReadOnlySet<LocationId> Locations);

/// <summary>FR-19: assigns roles and location access. An access rights change, so it is audited (NFR Audit).</summary>
public sealed class ChangeUserAccessUseCase(
    IUserRepository users, ICurrentUser currentUser, AuditTrail audit, IUnitOfWork unitOfWork)
{
    public async Task ExecuteAsync(ChangeUserAccessCommand command, CancellationToken ct)
    {
        currentUser.Require(Permissions.UsersManage);
        var user = await users.GetAsync(command.User, ct).OrNotFound("User");

        var (roles, locations) = (RolesOf(user), LocationsOf(user));
        user.ChangeRoles(command.Roles);
        user.ChangeAccess(new LocationAccess(command.Locations));
        audit.Record("user.access-changed", user.Id.ToString(),
            new FieldChange("roles", roles, RolesOf(user)), new FieldChange("locations", locations, LocationsOf(user)));
        await unitOfWork.CommitAsync(ct);
    }

    private static string RolesOf(User user) => string.Join(", ", user.Roles.Select(r => r.Value).Order());

    private static string LocationsOf(User user) =>
        user.Access.Everywhere ? "all" : string.Join(", ", user.Access.Locations.Select(l => l.Value).Order());
}
