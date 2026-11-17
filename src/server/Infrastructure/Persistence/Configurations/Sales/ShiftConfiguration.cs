namespace Infrastructure.Persistence.Configurations.Sales;

internal sealed class ShiftConfiguration() : AggregateRootConfiguration<Shift, ShiftId>("sales", $"{nameof(Shift)}s")
{
    protected override void ConfigureRoot(EntityTypeBuilder<Shift> builder)
    {
        builder.Property(x => x.LocationId);
        builder.Property(x => x.OpenedBy);
        builder.Property(x => x.OpenedAt);
        builder.Property(x => x.ClosedBy);
        builder.Property(x => x.ClosedAt);
        builder.HasIndex(x => x.LocationId).IsUnique().HasFilter($"[{nameof(Shift.ClosedAt)}] IS NULL");
        builder.Ignore(x => x.IsOpen);
    }
}
