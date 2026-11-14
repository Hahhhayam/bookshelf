using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Authorization.Infrastructure;

namespace WebApi.Security;

/// <summary>Allows the request only for a signed-in user holding any of the given permission codes from <see cref="Permissions"/>.</summary>
[AttributeUsage(AttributeTargets.Class | AttributeTargets.Method)]
public sealed class RequirePermissionAttribute(params string[] permissions) : AuthorizeAttribute, IAuthorizationRequirementData
{
    public IEnumerable<IAuthorizationRequirement> GetRequirements() =>
        [new DenyAnonymousAuthorizationRequirement(), new PermissionRequirement(permissions.ToHashSet())];
}
