namespace Application.Administration;

/// <summary>What a valid session token stands for: the user, and the rights their roles and location access give.</summary>
public sealed record AuthenticatedSession(
    Guid SessionId, UserId User, IReadOnlySet<Permission> Permissions, IReadOnlySet<LocationId> Locations);
