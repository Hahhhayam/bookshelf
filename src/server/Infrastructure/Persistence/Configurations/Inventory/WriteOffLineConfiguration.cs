namespace Infrastructure.Persistence.Configurations.Inventory;

internal sealed class WriteOffLineConfiguration : IEntityTypeConfiguration<WriteOffLine>
{
    public void Configure(EntityTypeBuilder<WriteOffLine> builder)
    {
        builder.ToTable($"{nameof(WriteOffLine)}s", "inventory");
        builder.Property<WriteOffId>(nameof(WriteOffId));
        builder.HasKey(nameof(WriteOffId), nameof(WriteOffLine.Id));
        builder.HasOne<WriteOff>().WithMany(w => w.Lines).HasForeignKey(nameof(WriteOffId)).OnDelete(DeleteBehavior.Cascade);
        builder.Property(x => x.Id).HasColumnName(nameof(BookId)).ValueGeneratedNever();
        builder.Property(x => x.Quantity);
    }
}
