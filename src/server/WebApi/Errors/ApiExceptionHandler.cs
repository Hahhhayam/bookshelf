using Microsoft.AspNetCore.Diagnostics;
using Microsoft.AspNetCore.Mvc;

namespace WebApi.Errors;

/// <summary>Maps the application's and domain's exceptions to HTTP problem details.</summary>
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
            ProblemDetails = new ProblemDetails { Status = status, Detail = exception.Message },
        });
    }

    private static int? StatusFor(Exception exception) => exception switch
    {
        NotFoundException => StatusCodes.Status404NotFound,
        ForbiddenException => StatusCodes.Status403Forbidden,
        PaymentDeclinedException => StatusCodes.Status402PaymentRequired,
        DomainException => StatusCodes.Status422UnprocessableEntity,
        _ => null,
    };
}
