namespace Infrastructure.Persistence.Configurations.Sales;

internal sealed class ReturnConfiguration() : AggregateRootConfiguration<Return, ReturnId>("sales", $"{nameof(Return)}s")
{
    protected override void ConfigureRoot(EntityTypeBuilder<Return> builder)
    {
        builder.Navigation(x => x.Lines).AutoInclude();
        builder.Property(x => x.SaleId);
        builder.HasIndex(x => x.SaleId);
        builder.Property(x => x.LocationId);
        builder.Property(x => x.CustomerId);
        builder.Property(x => x.Reason).HasMaxLength(500);
        builder.Property(x => x.Condition);
        builder.Property(x => x.Status);
        builder.HasIndex(x => new { x.LocationId, x.Status });
        builder.Property(x => x.IdempotencyKey).HasMaxLength(128).IsRequired();
        builder.HasIndex(x => x.IdempotencyKey).IsUnique();
        builder.Ignore(x => x.RefundTotal);
    }
}
