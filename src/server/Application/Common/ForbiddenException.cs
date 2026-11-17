namespace Application.Common;

public sealed class ForbiddenException(string message) : Exception(message)
{
    public const string Code = "forbidden";
}
