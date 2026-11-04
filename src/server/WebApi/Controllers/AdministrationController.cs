using Microsoft.AspNetCore.Mvc;

namespace WebApi.Controllers;

public sealed record LoginRequest(string Login, string Password);

public sealed record CreateUserRequest(string Login, string Password, Guid[] Locations, Guid[] Roles);

[ApiController]
public sealed class AdministrationController : ControllerBase
{
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

    [HttpPost("users/{id:guid}/block")]
    public async Task<IActionResult> Block(Guid id, [FromServices] BlockUserUseCase useCase, CancellationToken ct)
    {
        await useCase.ExecuteAsync(new UserId(id), ct);
        return NoContent();
    }

    [HttpPost("users/{id:guid}/unblock")]
    public async Task<IActionResult> Unblock(Guid id, [FromServices] UnblockUserUseCase useCase, CancellationToken ct)
    {
        await useCase.ExecuteAsync(new UserId(id), ct);
        return NoContent();
    }

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
