namespace Domain.Administration;

public readonly record struct AuditRecordId(Guid Value)
{
    public static AuditRecordId New() => new(Guid.CreateVersion7());
    public override string ToString() => Value.ToString();
}

/// <summary>An immutable, append-only record of one critical action.</summary>
public sealed class AuditRecord : AggregateRoot<AuditRecordId>
{
    public UserId? By { get; }
    public DateTimeOffset At { get; }
    public string Action { get; }
    public string? Subject { get; }
    public string? Before { get; }
    public string? After { get; }

    private AuditRecord(UserId? by, DateTimeOffset at, string action, string? subject, string? before, string? after)
        : base(AuditRecordId.New())
    {
        By = by;
        At = at;
        Action = action;
        Subject = subject;
        Before = before;
        After = after;
    }

    public static AuditRecord Record(UserId? by, DateTimeOffset at, string action, string? subject = null,
        string? before = null, string? after = null) =>
        new(by, at, Guard.NotBlank(action), subject, before, after);
}
