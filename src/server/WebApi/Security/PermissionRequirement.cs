using Microsoft.AspNetCore.Authorization;

namespace WebApi.Security;

/// <param name="AnyOf">Permission codes; holding one of them is enough.</param>
internal sealed record PermissionRequirement(IReadOnlySet<string> AnyOf) : IAuthorizationRequirement;
