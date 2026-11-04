using Domain.Inventory;

namespace Infrastructure.Persistence.Configurations.Inventory;

internal sealed class ReservationConfiguration : IEntityTypeConfiguration<Reservation>
{
    public void Configure(EntityTypeBuilder<Reservation> builder)
    {
        builder.ToTable($"{nameof(Reservation)}s", "inventory");
        builder.HasKey(x => x.Id);
        builder.Property(x => x.Id).ValueGeneratedNever();
        builder.Property<StockItemId>(nameof(StockItemId));
        builder.HasOne<StockItem>().WithMany(s => s.Reservations)
            .HasForeignKey(nameof(StockItemId)).OnDelete(DeleteBehavior.Cascade);
        builder.Property(x => x.Quantity);
        builder.Property(x => x.Purpose);
        builder.Property(x => x.DocumentId);
        builder.HasIndex(x => x.DocumentId);
        builder.Property(x => x.ExpiresAt);
        builder.Property(x => x.Status);
        builder.Ignore(x => x.IsActive);
    }
}
