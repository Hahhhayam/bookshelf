namespace Application.Common;

/// <summary>Writes the audit record for a critical action done by the current user (FR-17).</summary>
public sealed class AuditTrail(IAuditRecordRepository records, ICurrentUser user, IClock clock)
{
    public void Record(string action, string? subject, params IReadOnlyList<FieldChange> changes) =>
        records.Add(AuditRecord.Record(user.Id, clock.Now, action, subject, changes));
}
