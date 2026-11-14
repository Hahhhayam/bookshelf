namespace Infrastructure.Persistence.Configurations.Crm;

internal sealed class SegmentConfiguration() : AggregateRootConfiguration<Segment, SegmentId>("crm", $"{nameof(Segment)}s")
{
    protected override void ConfigureRoot(EntityTypeBuilder<Segment> builder)
    {
        builder.Property(x => x.Name).HasMaxLength(200).IsRequired();
        builder.Property(x => x.Description).HasMaxLength(1000);
    }
}
