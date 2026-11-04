using Domain.Orders;
using Infrastructure.Persistence.Configurations.ValueObjects;

namespace Infrastructure.Persistence.Configurations.Orders;

internal sealed class OrderConfiguration() : AggregateRootConfiguration<Order, OrderId>("orders", $"{nameof(Order)}s")
{
    protected override void ConfigureRoot(EntityTypeBuilder<Order> builder)
    {
        builder.Navigation(x => x.Lines).AutoInclude();
        builder.Property(x => x.CustomerId);
        builder.HasIndex(x => x.CustomerId);
        builder.Property(x => x.Type);
        builder.ComplexProperty(x => x.Fulfilment, FulfilmentMethodMapping.Configure);
        builder.Property(x => x.StockLocation);
        builder.Property(x => x.PickupCode).HasMaxLength(32);
        builder.Property(x => x.Status);
        builder.Ignore(x => x.Total);
    }
}
