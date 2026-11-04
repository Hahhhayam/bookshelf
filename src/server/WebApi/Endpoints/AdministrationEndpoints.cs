namespace WebApi.Endpoints;

public sealed record LoginRequest(string Login, string Password);

public sealed record CreateUserRequest(string Login, string Password, Guid[] Locations, Guid[] Roles);

internal static class AdministrationEndpoints
{
    public static void MapAdministrationEndpoints(this IEndpointRouteBuilder app)
    {
        app.MapPost("/auth/login", LoginAsync);
        app.MapGet("/audit", HistoryAsync);

        var users = app.MapGroup("/users");
        users.MapPost("/", CreateUserAsync);
        users.MapPost("/{id:guid}/block", BlockAsync);
        users.MapPost("/{id:guid}/unblock", UnblockAsync);
    }

    private static async Task<IResult> LoginAsync(LoginRequest request, LoginUseCase useCase, CancellationToken ct)
    {
        var outcome = await useCase.ExecuteAsync(new LoginCommand(request.Login, request.Password), ct);
        return outcome.Result switch
        {
            LoginResult.Success => Results.Ok(outcome.Session),
            LoginResult.Blocked => Results.Problem(statusCode: StatusCodes.Status403Forbidden, detail: "The account is blocked."),
            _ => Results.Problem(statusCode: StatusCodes.Status401Unauthorized, detail: "Invalid login or password."),
        };
    }

    private static async Task<IResult> CreateUserAsync(CreateUserRequest request, CreateUserUseCase useCase, CancellationToken ct)
    {
        var command = new CreateUserCommand(
            request.Login, request.Password,
            request.Locations.Select(l => new LocationId(l)).ToHashSet(),
            request.Roles.Select(r => new RoleId(r)).ToList());
        var id = await useCase.ExecuteAsync(command, ct);
        return Results.Created($"/users/{id.Value}", new { id = id.Value });
    }

    private static async Task<IResult> BlockAsync(Guid id, BlockUserUseCase useCase, CancellationToken ct)
    {
        await useCase.ExecuteAsync(new UserId(id), ct);
        return Results.NoContent();
    }

    private static async Task<IResult> UnblockAsync(Guid id, UnblockUserUseCase useCase, CancellationToken ct)
    {
        await useCase.ExecuteAsync(new UserId(id), ct);
        return Results.NoContent();
    }

    private static async Task<IResult> HistoryAsync(
        string? subject, string? action, DateTimeOffset? from, DateTimeOffset? to,
        GetChangeHistoryUseCase useCase, CancellationToken ct)
    {
        Period? period = from is { } start && to is { } end ? new Period(start, end) : null;
        var records = await useCase.ExecuteAsync(new AuditHistoryFilter(subject, period, action), ct);
        return Results.Ok(records.Select(r => new
        {
            id = r.Id.Value, by = r.By?.Value, r.At, r.Action, r.Subject, r.Before, r.After,
        }));
    }
}
