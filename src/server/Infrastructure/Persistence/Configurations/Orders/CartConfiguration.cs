using Domain.Orders;

namespace Infrastructure.Persistence.Configurations.Orders;

internal sealed class CartConfiguration() : AggregateRootConfiguration<Cart, CartId>("orders", $"{nameof(Cart)}s")
{
    protected override void ConfigureRoot(EntityTypeBuilder<Cart> builder)
    {
        builder.Navigation(x => x.Lines).AutoInclude();
        builder.Property(x => x.CustomerId);
        builder.HasIndex(x => x.CustomerId).IsUnique();
    }
}
