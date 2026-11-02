namespace Domain.Administration;

public sealed class User : AggregateRoot<UserId>
{
    private readonly HashSet<RoleId> _roles = [];

    public string Login { get; }
    public PasswordHash PasswordHash { get; private set; }
    public UserStatus Status { get; private set; } = UserStatus.Active;
    public LocationAccess Access { get; private set; }
    public IReadOnlyCollection<RoleId> Roles => _roles;

    private User(UserId id, string login, PasswordHash passwordHash, LocationAccess access) : base(id)
    {
        Login = login;
        PasswordHash = passwordHash;
        Access = access;
    }

    public static User Create(string login, PasswordHash passwordHash, LocationAccess access, IEnumerable<RoleId> roles)
    {
        var user = new User(UserId.New(), Guard.NotBlank(login), passwordHash, access);
        user._roles.UnionWith(roles);
        return user;
    }

    /// <summary>
    /// Records a login attempt. The password check itself happens outside the domain;
    /// a failure is logged without the password.
    /// </summary>
    public LoginResult Authenticate(bool passwordMatches, DateTimeOffset now)
    {
        var result = Status == UserStatus.Blocked ? LoginResult.Blocked
            : passwordMatches ? LoginResult.Success
            : LoginResult.InvalidCredentials;
        if (result != LoginResult.Success)
            Raise(new LoginFailed(Id, Login, result, now));
        return result;
    }

    public void Block() => Status = UserStatus.Blocked;

    public void Unblock() => Status = UserStatus.Active;

    public void ChangePassword(PasswordHash hash) => PasswordHash = hash;

    public void AssignRole(RoleId role) => _roles.Add(role);

    public void RevokeRole(RoleId role) => _roles.Remove(role);

    public void ChangeAccess(LocationAccess access) => Access = access;
}
