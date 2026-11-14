namespace Infrastructure.Persistence.Configurations.Inventory;

internal sealed class TransferLineConfiguration : IEntityTypeConfiguration<TransferLine>
{
    public void Configure(EntityTypeBuilder<TransferLine> builder)
    {
        builder.ToTable($"{nameof(TransferLine)}s", "inventory");
        builder.Property<TransferId>(nameof(TransferId));
        builder.HasKey(nameof(TransferId), nameof(TransferLine.Id));
        builder.HasOne<Transfer>().WithMany(t => t.Lines).HasForeignKey(nameof(TransferId)).OnDelete(DeleteBehavior.Cascade);
        builder.Property(x => x.Id).HasColumnName(nameof(BookId)).ValueGeneratedNever();
        builder.Property(x => x.Shipped);
        builder.Property(x => x.Received);
    }
}
