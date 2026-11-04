using Domain.Orders;
using Infrastructure.Persistence.Configurations.ValueObjects;

namespace Infrastructure.Persistence.Configurations.Orders;

internal sealed class OrderLineConfiguration : IEntityTypeConfiguration<OrderLine>
{
    public void Configure(EntityTypeBuilder<OrderLine> builder)
    {
        builder.ToTable($"{nameof(OrderLine)}s", "orders");
        builder.Property<OrderId>(nameof(OrderId));
        builder.HasKey(nameof(OrderId), nameof(OrderLine.Id));
        builder.HasOne<Order>().WithMany(o => o.Lines).HasForeignKey(nameof(OrderId)).OnDelete(DeleteBehavior.Cascade);
        builder.Property(x => x.Id).HasColumnName(nameof(BookId)).ValueGeneratedNever();
        builder.Property(x => x.Quantity);
        builder.ComplexProperty(x => x.UnitPrice, MoneyMapping.Configure);
        builder.Ignore(x => x.Total);
    }
}
