using System.Runtime.CompilerServices;

namespace Shared;

public static class Guard
{
    public const string BlankCode = "blank";

    public static string NotBlank(string? value, [CallerArgumentExpression(nameof(value))] string? name = null)
    {
        if (string.IsNullOrWhiteSpace(value))
            throw new DomainException(BlankCode, $"{name} must not be blank.", FieldName(name));
        return value.Trim();
    }

    public static void That(bool condition, string code, string message)
    {
        if (!condition)
            throw new DomainException(code, message);
    }

    // The caller expression may be a member access such as "request.GiftCertificateNumber"; clients get "giftCertificateNumber".
    private static string? FieldName(string? expression)
    {
        if (string.IsNullOrWhiteSpace(expression))
            return null;
        var last = expression[(expression.LastIndexOf('.') + 1)..];
        return char.ToLowerInvariant(last[0]) + last[1..];
    }
}
