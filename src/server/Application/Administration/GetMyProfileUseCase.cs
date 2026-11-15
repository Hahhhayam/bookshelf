namespace Application.Administration;

/// <summary>Any signed-in employee may read their own profile; it needs no permission.</summary>
public sealed class GetMyProfileUseCase(IUserProfileQuery profiles, ICurrentUser user)
{
    public Task<UserProfile> ExecuteAsync(CancellationToken ct) =>
        profiles.FindAsync(user.Id, ct).OrNotFound("User");
}
