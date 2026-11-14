namespace Infrastructure.Persistence.Configurations.Inventory;

internal sealed class TransferDiscrepancyConfiguration : IEntityTypeConfiguration<Domain.Inventory.Discrepancy>
{
    public void Configure(EntityTypeBuilder<Domain.Inventory.Discrepancy> builder)
    {
        builder.ToTable("TransferDiscrepancies", "inventory");
        builder.HasKey(x => x.Id);
        builder.Property(x => x.Id).ValueGeneratedNever();
        builder.Property<TransferId>(nameof(TransferId));
        builder.HasOne<Transfer>().WithMany(t => t.Discrepancies)
            .HasForeignKey(nameof(TransferId)).OnDelete(DeleteBehavior.Cascade);
        builder.Property(x => x.BookId);
        builder.Property(x => x.Expected);
        builder.Property(x => x.Actual);
        builder.Property(x => x.IsResolved);
    }
}
