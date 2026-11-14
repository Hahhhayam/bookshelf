namespace Infrastructure.Persistence.Configurations.Catalog;

internal sealed class CategoryConfiguration() : AggregateRootConfiguration<Category, CategoryId>("catalog", "Categories")
{
    protected override void ConfigureRoot(EntityTypeBuilder<Category> builder) =>
        builder.Property(x => x.Name).HasMaxLength(200).IsRequired();
}
