namespace Infrastructure.Persistence.Configurations.Inventory;

internal sealed class CountLineConfiguration : IEntityTypeConfiguration<CountLine>
{
    public void Configure(EntityTypeBuilder<CountLine> builder)
    {
        builder.ToTable($"{nameof(CountLine)}s", "inventory");
        builder.Property<InventoryCountId>(nameof(InventoryCountId));
        builder.HasKey(nameof(InventoryCountId), nameof(CountLine.Id));
        builder.HasOne<InventoryCount>().WithMany(c => c.Lines)
            .HasForeignKey(nameof(InventoryCountId)).OnDelete(DeleteBehavior.Cascade);
        builder.Property(x => x.Id).HasColumnName(nameof(BookId)).ValueGeneratedNever();
        builder.Property(x => x.Expected);
        builder.Property(x => x.Counted);
    }
}
