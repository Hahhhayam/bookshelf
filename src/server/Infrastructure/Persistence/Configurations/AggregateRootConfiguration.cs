namespace Infrastructure.Persistence.Configurations;

internal abstract class AggregateRootConfiguration<TRoot, TId>(string schema, string table) : IEntityTypeConfiguration<TRoot>
    where TRoot : AggregateRoot<TId>
    where TId : notnull
{
    public void Configure(EntityTypeBuilder<TRoot> builder)
    {
        builder.ToTable(table, schema);
        builder.HasKey(x => x.Id);
        builder.Property(x => x.Id).ValueGeneratedNever();
        builder.Ignore(x => x.DomainEvents);
        ConfigureRoot(builder);
    }

    protected abstract void ConfigureRoot(EntityTypeBuilder<TRoot> builder);
}
