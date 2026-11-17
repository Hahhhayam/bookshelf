using Microsoft.AspNetCore.Diagnostics;
using Microsoft.AspNetCore.Mvc;

namespace WebApi.Errors;

/// <summary>Maps the application's and domain's exceptions to HTTP problem details with a stable <c>code</c>
/// (see ERROR_CODES.md) and, when the error concerns one field or subject, <c>field</c> or <c>subject</c>.</summary>
internal sealed class ApiExceptionHandler(IProblemDetailsService problems) : IExceptionHandler
{
    public async ValueTask<bool> TryHandleAsync(HttpContext context, Exception exception, CancellationToken ct)
    {
        var status = StatusFor(exception);
        if (status is null)
            return false;

        context.Response.StatusCode = status.Value;
        return await problems.TryWriteAsync(new ProblemDetailsContext
        {
            HttpContext = context,
            Exception = exception,
            ProblemDetails = ProblemFor(exception, status.Value),
        });
    }

    private static ProblemDetails ProblemFor(Exception exception, int status)
    {
        var problem = new ProblemDetails { Status = status, Detail = exception.Message };
        if (CodeFor(exception) is { } code)
            problem.Extensions["code"] = code;
        if (exception is DomainException { Field: { } field })
            problem.Extensions["field"] = field;
        if (exception is NotFoundException notFound)
            problem.Extensions["subject"] = notFound.Subject;
        return problem;
    }

    private static int? StatusFor(Exception exception) => exception switch
    {
        UnauthorizedAccessException => StatusCodes.Status401Unauthorized,
        NotFoundException => StatusCodes.Status404NotFound,
        ForbiddenException => StatusCodes.Status403Forbidden,
        PaymentDeclinedException => StatusCodes.Status402PaymentRequired,
        DomainException => StatusCodes.Status422UnprocessableEntity,
        _ => null,
    };

    private static string? CodeFor(Exception exception) => exception switch
    {
        UnauthorizedAccessException => "unauthenticated",
        NotFoundException => NotFoundException.Code,
        ForbiddenException => ForbiddenException.Code,
        PaymentDeclinedException => PaymentDeclinedException.Code,
        DomainException domain => domain.Code,
        _ => null,
    };
}
