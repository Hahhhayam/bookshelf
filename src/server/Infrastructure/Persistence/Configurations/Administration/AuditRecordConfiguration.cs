namespace Infrastructure.Persistence.Configurations.Administration;

internal sealed class AuditRecordConfiguration()
    : AggregateRootConfiguration<AuditRecord, AuditRecordId>("administration", $"{nameof(AuditRecord)}s")
{
    protected override void ConfigureRoot(EntityTypeBuilder<AuditRecord> builder)
    {
        builder.Property(x => x.By);
        builder.Property(x => x.At);
        builder.Property(x => x.Action).HasMaxLength(128).IsRequired();
        builder.Property(x => x.Subject).HasMaxLength(256);
        builder.Property(x => x.Before);
        builder.Property(x => x.After);
        builder.HasIndex(x => new { x.Subject, x.At });
    }
}
