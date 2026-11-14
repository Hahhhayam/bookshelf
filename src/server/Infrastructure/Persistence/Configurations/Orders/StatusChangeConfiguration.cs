namespace Infrastructure.Persistence.Configurations.Orders;

internal sealed class StatusChangeConfiguration : IEntityTypeConfiguration<StatusChange>
{
    public void Configure(EntityTypeBuilder<StatusChange> builder)
    {
        builder.ToTable("OrderStatusChanges", "orders");
        builder.HasKey(x => x.Id);
        builder.Property(x => x.Id).ValueGeneratedNever();
        builder.Property<OrderId>(nameof(OrderId));
        builder.HasOne<Order>().WithMany(o => o.History).HasForeignKey(nameof(OrderId)).OnDelete(DeleteBehavior.Cascade);
        builder.Property(x => x.From);
        builder.Property(x => x.To);
        builder.Property(x => x.At);
        builder.Property(x => x.By);
    }
}
