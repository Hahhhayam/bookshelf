namespace Shared;

public readonly record struct AuditRecordId(Guid Value)
{
    public static AuditRecordId New() => new(Guid.CreateVersion7());
    public override string ToString() => Value.ToString();
}
