namespace Infrastructure.Persistence.Configurations.Administration;

internal sealed class IntegrationConfiguration()
    : AggregateRootConfiguration<Integration, IntegrationId>("administration", $"{nameof(Integration)}s")
{
    protected override void ConfigureRoot(EntityTypeBuilder<Integration> builder)
    {
        builder.Property(x => x.Kind);
        builder.Property(x => x.Name).HasMaxLength(200).IsRequired();
        builder.Property(x => x.IsEnabled);
        builder.Property(x => x.Status);
        builder.Property(x => x.LastError);
        builder.Property(x => x.LastErrorAt);
        builder.Property(x => x.LastExchangeAt);
    }
}
