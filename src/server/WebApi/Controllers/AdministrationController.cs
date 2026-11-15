using System.Security.Claims;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using WebApi.Contracts;
using WebApi.Security;

namespace WebApi.Controllers;

public sealed record LoginRequest(string Login, string Password);

public sealed record CreateUserRequest(string Login, string Password, Guid[] Locations, Guid[] Roles);

public sealed record ChangeUserAccessRequest(Guid[] Roles, Guid[] Locations);

public sealed record RoleRequest(string Name, string[] Permissions);

public sealed record CreateLocationRequest(string Name, LocationType Type, string Address);

public sealed record UpdateLocationRequest(string Name, string Address);

public sealed record CreateIntegrationRequest(IntegrationKind Kind, string Name);

public sealed record SetEnabledRequest(bool Enabled);

[ApiController]
public sealed class AdministrationController : ControllerBase
{
    [AllowAnonymous]
    [HttpPost("auth/login")]
    public async Task<IActionResult> Login(
        LoginRequest request, [FromServices] LoginUseCase useCase, CancellationToken ct)
    {
        var outcome = await useCase.ExecuteAsync(new LoginCommand(request.Login, request.Password), ct);
        return outcome.Result switch
        {
            LoginResult.Success => Ok(outcome.Session),
            LoginResult.Blocked => Problem(statusCode: StatusCodes.Status403Forbidden, detail: "The account is blocked."),
            _ => Problem(statusCode: StatusCodes.Status401Unauthorized, detail: "Invalid login or password."),
        };
    }

    [HttpGet("auth/me")]
    public async Task<IActionResult> Me([FromServices] GetMyProfileUseCase useCase, CancellationToken ct)
    {
        var profile = await useCase.ExecuteAsync(ct);
        return Ok(new
        {
            id = profile.User.Value, profile.Login, profile.Permissions,
            locations = profile.Locations.Select(l => new { id = l.Location.Value, l.Name, l.Type }),
        });
    }

    [HttpPost("auth/logout")]
    public async Task<IActionResult> Logout([FromServices] LogoutUseCase useCase, CancellationToken ct)
    {
        await useCase.ExecuteAsync(Guid.Parse(User.FindFirstValue(BookstoreClaims.Session)!), ct);
        return NoContent();
    }

    [RequirePermission(Permissions.UsersManage)]
    [HttpPost("users")]
    public async Task<IActionResult> CreateUser(
        CreateUserRequest request, [FromServices] CreateUserUseCase useCase, CancellationToken ct)
    {
        var command = new CreateUserCommand(
            request.Login, request.Password,
            request.Locations.Select(l => new LocationId(l)).ToHashSet(),
            request.Roles.Select(r => new RoleId(r)).ToList());
        var id = await useCase.ExecuteAsync(command, ct);
        return Created($"users/{id.Value}", new { id = id.Value });
    }

    [RequirePermission(Permissions.UsersManage)]
    [HttpPost("users/{id:guid}/block")]
    public async Task<IActionResult> Block(Guid id, [FromServices] BlockUserUseCase useCase, CancellationToken ct)
    {
        await useCase.ExecuteAsync(new UserId(id), ct);
        return NoContent();
    }

    [RequirePermission(Permissions.UsersManage)]
    [HttpPost("users/{id:guid}/unblock")]
    public async Task<IActionResult> Unblock(Guid id, [FromServices] UnblockUserUseCase useCase, CancellationToken ct)
    {
        await useCase.ExecuteAsync(new UserId(id), ct);
        return NoContent();
    }

    [RequirePermission(Permissions.UsersManage)]
    [HttpPut("users/{id:guid}/access")]
    public async Task<IActionResult> ChangeAccess(
        Guid id, ChangeUserAccessRequest request, [FromServices] ChangeUserAccessUseCase useCase, CancellationToken ct)
    {
        var command = new ChangeUserAccessCommand(
            new UserId(id), request.Roles.Select(r => new RoleId(r)).ToList(),
            request.Locations.Select(l => new LocationId(l)).ToHashSet());
        await useCase.ExecuteAsync(command, ct);
        return NoContent();
    }

    [RequirePermission(Permissions.UsersManage)]
    [HttpPost("roles")]
    public async Task<IActionResult> CreateRole(
        RoleRequest request, [FromServices] CreateRoleUseCase useCase, CancellationToken ct)
    {
        var id = await useCase.ExecuteAsync(request.Name, ToPermissions(request), ct);
        return Created($"roles/{id.Value}", new { id = id.Value });
    }

    [RequirePermission(Permissions.UsersManage)]
    [HttpPut("roles/{id:guid}")]
    public async Task<IActionResult> UpdateRole(
        Guid id, RoleRequest request, [FromServices] UpdateRoleUseCase useCase, CancellationToken ct)
    {
        await useCase.ExecuteAsync(new RoleId(id), request.Name, ToPermissions(request), ct);
        return NoContent();
    }

    private static HashSet<Permission> ToPermissions(RoleRequest request) =>
        request.Permissions.Select(code => new Permission(code)).ToHashSet();

    [RequirePermission(Permissions.LocationsManage)]
    [HttpPost("locations")]
    public async Task<IActionResult> CreateLocation(
        CreateLocationRequest request, [FromServices] CreateLocationUseCase useCase, CancellationToken ct)
    {
        var command = new CreateLocationCommand(request.Name, request.Type, new Address(request.Address));
        var id = await useCase.ExecuteAsync(command, ct);
        return Created($"locations/{id.Value}", new { id = id.Value });
    }

    [RequirePermission(Permissions.LocationsManage)]
    [HttpPut("locations/{id:guid}")]
    public async Task<IActionResult> UpdateLocation(
        Guid id, UpdateLocationRequest request, [FromServices] UpdateLocationUseCase useCase, CancellationToken ct)
    {
        await useCase.ExecuteAsync(new LocationId(id), request.Name, new Address(request.Address), ct);
        return NoContent();
    }

    [RequirePermission(Permissions.LocationsManage)]
    [HttpPut("locations/{id:guid}/active")]
    public async Task<IActionResult> SetLocationActive(
        Guid id, SetActiveRequest request, [FromServices] SetLocationActiveUseCase useCase, CancellationToken ct)
    {
        await useCase.ExecuteAsync(new LocationId(id), request.Active, ct);
        return NoContent();
    }

    [RequirePermission(Permissions.IntegrationsManage)]
    [HttpPost("integrations")]
    public async Task<IActionResult> CreateIntegration(
        CreateIntegrationRequest request, [FromServices] CreateIntegrationUseCase useCase, CancellationToken ct)
    {
        var id = await useCase.ExecuteAsync(request.Kind, request.Name, ct);
        return Created($"integrations/{id.Value}", new { id = id.Value });
    }

    [RequirePermission(Permissions.IntegrationsManage)]
    [HttpPut("integrations/{id:guid}/enabled")]
    public async Task<IActionResult> SetIntegrationEnabled(
        Guid id, SetEnabledRequest request, [FromServices] SetIntegrationEnabledUseCase useCase, CancellationToken ct)
    {
        await useCase.ExecuteAsync(new IntegrationId(id), request.Enabled, ct);
        return NoContent();
    }

    [RequirePermission(Permissions.AuditView)]
    [HttpGet("audit")]
    public async Task<IActionResult> History(
        string? subject, string? action, DateTimeOffset? from, DateTimeOffset? to,
        [FromServices] GetChangeHistoryUseCase useCase, CancellationToken ct)
    {
        Period? period = from is { } start && to is { } end ? new Period(start, end) : null;
        var records = await useCase.ExecuteAsync(new AuditHistoryFilter(subject, period, action), ct);
        return Ok(records.Select(r => new
        {
            id = r.Id.Value, by = r.By?.Value, r.At, r.Action, r.Subject, r.Before, r.After,
        }));
    }
}
