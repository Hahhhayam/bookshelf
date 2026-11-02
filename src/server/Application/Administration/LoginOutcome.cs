namespace Application.Administration;

public sealed record LoginOutcome(LoginResult Result, Session? Session)
{
    public static LoginOutcome Succeeded(Session session) => new(LoginResult.Success, session);

    public static LoginOutcome Failed(LoginResult result) => new(result, null);
}
