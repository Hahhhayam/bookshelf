namespace Infrastructure.Persistence.Configurations.Catalog;

internal sealed class AuthorConfiguration() : AggregateRootConfiguration<Author, AuthorId>("catalog", $"{nameof(Author)}s")
{
    protected override void ConfigureRoot(EntityTypeBuilder<Author> builder)
    {
        builder.Property(x => x.Name).HasMaxLength(200).IsRequired();
        builder.Property(x => x.IsActive);
    }
}
