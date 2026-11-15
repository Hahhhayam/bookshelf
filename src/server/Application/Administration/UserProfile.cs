namespace Application.Administration;

/// <summary>What the signed-in employee may do and where: the client builds its navigation and location switcher from it.</summary>
public sealed record UserProfile(
    UserId User, string Login, IReadOnlyList<string> Permissions, IReadOnlyList<ProfileLocation> Locations);
