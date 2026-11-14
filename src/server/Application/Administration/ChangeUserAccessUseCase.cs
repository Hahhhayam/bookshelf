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

        var before = Describe(user);
        user.ChangeRoles(command.Roles);
        user.ChangeAccess(new LocationAccess(command.Locations));
        audit.Record("user.access-changed", user.Id.ToString(), before, Describe(user));
        await unitOfWork.CommitAsync(ct);
    }

    private static string Describe(User user) =>
        $"roles: {string.Join(", ", user.Roles.Select(r => r.Value).Order())}; " +
        $"locations: {string.Join(", ", user.Access.Locations.Select(l => l.Value).Order())}";
}
