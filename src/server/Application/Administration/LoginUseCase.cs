namespace Application.Administration;

public sealed record LoginCommand(string Login, string Password);

/// <summary>Scenario 3.1. A failed attempt is saved too, so its LoginFailed event reaches the audit log.</summary>
public sealed class LoginUseCase(
    IUserRepository users, IPasswordHasher hasher, ISessionIssuer sessions, IClock clock, IUnitOfWork unitOfWork)
{
    public async Task<LoginOutcome> ExecuteAsync(LoginCommand command, CancellationToken ct)
    {
        var user = await users.FindByLoginAsync(command.Login, ct);
        if (user is null)
            return LoginOutcome.Failed(LoginResult.InvalidCredentials);

        var passwordMatches = hasher.Verify(user.PasswordHash, command.Password);
        var result = user.Authenticate(passwordMatches, clock.Now);
        await unitOfWork.CommitAsync(ct);

        return result == LoginResult.Success
            ? LoginOutcome.Succeeded(await sessions.IssueAsync(user.Id, ct))
            : LoginOutcome.Failed(result);
    }
}
