namespace Application.Administration;

public sealed record CreateUserCommand(
    string Login, string Password, IReadOnlySet<LocationId> Locations, IReadOnlyList<RoleId> Roles);
