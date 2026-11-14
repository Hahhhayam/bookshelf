using Infrastructure.Persistence.Configurations.ValueObjects;

namespace Infrastructure.Persistence.Configurations.Sales;

internal sealed class ReturnLineConfiguration : IEntityTypeConfiguration<ReturnLine>
{
    public void Configure(EntityTypeBuilder<ReturnLine> builder)
    {
        builder.ToTable($"{nameof(ReturnLine)}s", "sales");
        builder.Property<ReturnId>(nameof(ReturnId));
        builder.HasKey(nameof(ReturnId), nameof(ReturnLine.Id));
        builder.HasOne<Return>().WithMany(r => r.Lines).HasForeignKey(nameof(ReturnId)).OnDelete(DeleteBehavior.Cascade);
        builder.Property(x => x.Id).HasColumnName(nameof(BookId)).ValueGeneratedNever();
        builder.Property(x => x.Quantity);
        builder.ComplexProperty(x => x.UnitRefund, MoneyMapping.Configure);
        builder.Ignore(x => x.Refund);
    }
}
