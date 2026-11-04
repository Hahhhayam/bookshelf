using Domain.Inventory;

namespace Infrastructure.Persistence.Configurations.Inventory;

internal sealed class WriteOffConfiguration() : AggregateRootConfiguration<WriteOff, WriteOffId>("inventory", $"{nameof(WriteOff)}s")
{
    protected override void ConfigureRoot(EntityTypeBuilder<WriteOff> builder)
    {
        builder.Property(x => x.LocationId);
        builder.Property(x => x.Reason).HasMaxLength(500);
        builder.Property(x => x.CreatedBy);
        builder.Property(x => x.CreatedAt);
    }
}
