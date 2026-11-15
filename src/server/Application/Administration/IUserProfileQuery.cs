namespace Application.Administration;

public interface IUserProfileQuery
{
    /// <summary>Permissions of all the user's roles, and the active locations the user may work in.</summary>
    Task<UserProfile?> FindAsync(UserId user, CancellationToken ct);
}
