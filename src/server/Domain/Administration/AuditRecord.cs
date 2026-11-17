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
    public IReadOnlyList<FieldChange> Changes { get; }

    private AuditRecord(UserId? by, DateTimeOffset at, string action, string? subject, IReadOnlyList<FieldChange> changes)
        : base(AuditRecordId.New())
    {
        By = by;
        At = at;
        Action = action;
        Subject = subject;
        Changes = changes;
    }

    /// <summary>A key field whose value stayed the same is not a change, so it is left out.</summary>
    public static AuditRecord Record(UserId? by, DateTimeOffset at, string action, string? subject,
        params IReadOnlyList<FieldChange> changes) =>
        new(by, at, Guard.NotBlank(action), subject, changes.Where(c => c.Before != c.After).ToList());
}
