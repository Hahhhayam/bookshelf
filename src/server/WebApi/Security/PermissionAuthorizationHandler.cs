using Microsoft.AspNetCore.Authorization;

namespace WebApi.Security;

internal sealed class PermissionAuthorizationHandler : AuthorizationHandler<PermissionRequirement>
{
    protected override Task HandleRequirementAsync(AuthorizationHandlerContext context, PermissionRequirement requirement)
    {
        if (requirement.AnyOf.Any(code => context.User.HasClaim(BookstoreClaims.Permission, code)))
            context.Succeed(requirement);
        return Task.CompletedTask;
    }
}
