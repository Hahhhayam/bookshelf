using Domain.Orders;

namespace Infrastructure.Persistence.Configurations.Orders;

internal sealed class CartLineConfiguration : IEntityTypeConfiguration<CartLine>
{
    public void Configure(EntityTypeBuilder<CartLine> builder)
    {
        builder.ToTable($"{nameof(CartLine)}s", "orders");
        builder.Property<CartId>(nameof(CartId));
        builder.HasKey(nameof(CartId), nameof(CartLine.Id));
        builder.HasOne<Cart>().WithMany(c => c.Lines).HasForeignKey(nameof(CartId)).OnDelete(DeleteBehavior.Cascade);
        builder.Property(x => x.Id).HasColumnName(nameof(BookId)).ValueGeneratedNever();
        builder.Property(x => x.Quantity);
    }
}
