namespace Application.Common;

public sealed class NotFoundException(string what) : Exception($"{what} was not found.")
{
    public const string Code = "not-found";

    public string Subject { get; } = what;
}
