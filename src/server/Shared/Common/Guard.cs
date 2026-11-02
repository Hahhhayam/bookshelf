using System.Runtime.CompilerServices;

namespace Shared;

public static class Guard
{
    public static string NotBlank(string? value, [CallerArgumentExpression(nameof(value))] string? name = null)
    {
        if (string.IsNullOrWhiteSpace(value))
            throw new DomainException($"{name} must not be blank.");
        return value.Trim();
    }

    public static void That(bool condition, string message)
    {
        if (!condition)
            throw new DomainException(message);
    }
}
