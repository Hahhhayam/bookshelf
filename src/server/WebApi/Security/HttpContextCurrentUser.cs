using System.Security.Claims;

namespace WebApi.Security;

internal sealed class HttpContextCurrentUser(IHttpContextAccessor accessor) : ICurrentUser
{
    private ClaimsPrincipal Principal => accessor.HttpContext?.User ?? new ClaimsPrincipal();

    public UserId Id =>
        Guid.TryParse(Principal.FindFirstValue(BookstoreClaims.UserId), out var id)
            ? new UserId(id)
            : throw new UnauthorizedAccessException("The request is not authenticated.");

    public bool Has(Permission permission) =>
        Principal.HasClaim(BookstoreClaims.Permission, permission.Code);

    public IReadOnlyCollection<LocationId> AccessibleLocations =>
        Principal.FindAll(BookstoreClaims.Location)
            .Select(c => new LocationId(Guid.Parse(c.Value))).ToList();

    public bool CanAccess(LocationId location) =>
        Principal.HasClaim(BookstoreClaims.Location, location.Value.ToString());
}
