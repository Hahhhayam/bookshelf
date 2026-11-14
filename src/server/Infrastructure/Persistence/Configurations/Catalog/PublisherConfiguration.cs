namespace Infrastructure.Persistence.Configurations.Catalog;

internal sealed class PublisherConfiguration() : AggregateRootConfiguration<Publisher, PublisherId>("catalog", $"{nameof(Publisher)}s")
{
    protected override void ConfigureRoot(EntityTypeBuilder<Publisher> builder)
    {
        builder.Property(x => x.Name).HasMaxLength(200).IsRequired();
        builder.Property(x => x.IsActive);
    }
}
