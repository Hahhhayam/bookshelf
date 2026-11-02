namespace Application.Common;

public static class CurrentUserExtensions
{
    public static void Require(this ICurrentUser user, Permission permission)
    {
        if (!user.Has(permission))
            throw new ForbiddenException($"Permission '{permission}' is required.");
    }

    public static void RequireAccess(this ICurrentUser user, LocationId location)
    {
        if (!user.CanAccess(location))
            throw new ForbiddenException("The user has no access to this location.");
    }
}
