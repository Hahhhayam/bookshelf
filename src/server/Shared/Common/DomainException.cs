namespace Shared;

/// <summary>A broken business rule. <see cref="Code"/> is stable and machine-readable (listed in ERROR_CODES.md);
/// the message is English text for logs and tests.</summary>
public class DomainException(string code, string message, string? field = null) : Exception(message)
{
    public string Code { get; } = code;

    public string? Field { get; } = field;
}
