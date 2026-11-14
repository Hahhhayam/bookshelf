namespace Infrastructure.Persistence.Configurations;

/// <param name="parentColumn">Names the parent's column after its aggregate (e.g. OrderId) instead of ParentId.</param>
internal abstract class ChangeConfiguration<TChange, TParentId, TValue>(string schema, string table, string parentColumn)
    : AggregateRootConfiguration<TChange, Guid>(schema, table)
    where TChange : Change<TParentId, TValue>
    where TParentId : struct
    where TValue : notnull
{
    protected override void ConfigureRoot(EntityTypeBuilder<TChange> builder)
    {
        builder.Property(x => x.ParentId).HasColumnName(parentColumn);
        builder.HasIndex(x => new { x.ParentId, x.At });
        builder.Property(x => x.From);
        builder.Property(x => x.To);
        builder.Property(x => x.At);
        builder.Property(x => x.By);
    }
}
