namespace Application.Administration;

public sealed class UnblockUserUseCase(
    IUserRepository users, ICurrentUser currentUser, AuditTrail audit, IUnitOfWork unitOfWork)
{
    public async Task ExecuteAsync(UserId userId, CancellationToken ct)
    {
        currentUser.Require(Permissions.UsersManage);
        var user = await users.GetAsync(userId, ct).OrNotFound("User");

        user.Unblock();
        audit.Record("user.unblocked", userId.ToString(),
            new FieldChange("status", UserStatus.Blocked.ToString(), UserStatus.Active.ToString()));
        await unitOfWork.CommitAsync(ct);
    }
}
