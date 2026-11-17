namespace Application.Administration;

public sealed record CreateUserCommand(
    string Login, string Password, IReadOnlySet<LocationId> Locations, IReadOnlyList<RoleId> Roles);

public sealed class CreateUserUseCase(
    IUserRepository users, IPasswordHasher hasher, ICurrentUser currentUser, AuditTrail audit, IUnitOfWork unitOfWork)
{
    public async Task<UserId> ExecuteAsync(CreateUserCommand command, CancellationToken ct)
    {
        currentUser.Require(Permissions.UsersManage);
        Guard.That(await users.FindByLoginAsync(command.Login, ct) is null, "login-taken", "This login is already taken.");

        var user = User.Create(command.Login, hasher.Hash(command.Password),
            new LocationAccess(command.Locations), command.Roles);
        users.Add(user);
        audit.Record("user.created", user.Id.ToString(), FieldChange.Set("login", user.Login));
        await unitOfWork.CommitAsync(ct);
        return user.Id;
    }
}
