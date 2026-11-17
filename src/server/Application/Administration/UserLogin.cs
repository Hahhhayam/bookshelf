namespace Application.Administration;

/// <summary>How a user is named wherever a user id is shown: in histories, "last changed by" and the audit log.</summary>
public sealed record UserLogin(UserId User, string Login);
