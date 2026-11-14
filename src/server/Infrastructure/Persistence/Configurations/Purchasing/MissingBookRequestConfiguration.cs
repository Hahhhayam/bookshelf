namespace Infrastructure.Persistence.Configurations.Purchasing;

internal sealed class MissingBookRequestConfiguration()
    : AggregateRootConfiguration<MissingBookRequest, MissingBookRequestId>("purchasing", $"{nameof(MissingBookRequest)}s")
{
    protected override void ConfigureRoot(EntityTypeBuilder<MissingBookRequest> builder)
    {
        builder.Property(x => x.Title).HasMaxLength(500).IsRequired();
        builder.Property(x => x.Author).HasMaxLength(200);
        builder.Property(x => x.LocationId);
        builder.Property(x => x.CustomerId);
        builder.Property(x => x.Demand);
        builder.Property(x => x.Status);
        builder.HasIndex(x => new { x.Status, x.Title });
        builder.Property(x => x.RecordedAt);
    }
}
