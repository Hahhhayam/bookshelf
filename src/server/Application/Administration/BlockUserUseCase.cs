namespace Application.Administration;

public sealed class BlockUserUseCase(
    IUserRepository users, ICurrentUser currentUser, AuditTrail audit, IUnitOfWork unitOfWork)
{
    public async Task ExecuteAsync(UserId userId, CancellationToken ct)
    {
        currentUser.Require(Permissions.UsersManage);
        var user = await users.GetAsync(userId, ct).OrNotFound("User");

        user.Block();
        audit.Record("user.blocked", userId.ToString(),
            new FieldChange("status", UserStatus.Active.ToString(), UserStatus.Blocked.ToString()));
        await unitOfWork.CommitAsync(ct);
    }
}
