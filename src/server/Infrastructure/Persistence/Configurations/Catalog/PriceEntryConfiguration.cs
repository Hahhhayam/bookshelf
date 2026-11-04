using Domain.Catalog;
using Infrastructure.Persistence.Configurations.ValueObjects;

namespace Infrastructure.Persistence.Configurations.Catalog;

internal sealed class PriceEntryConfiguration : IEntityTypeConfiguration<PriceEntry>
{
    public void Configure(EntityTypeBuilder<PriceEntry> builder)
    {
        builder.ToTable("PriceEntries", "catalog");
        builder.HasKey(x => x.Id);
        builder.Property(x => x.Id).ValueGeneratedNever();
        builder.Property<BookId>(nameof(BookId));
        builder.HasOne<Book>().WithMany(b => b.PriceHistory).HasForeignKey(nameof(BookId)).OnDelete(DeleteBehavior.Cascade);
        builder.ComplexProperty(x => x.Price, MoneyMapping.Configure);
        builder.Property(x => x.ValidFrom);
        builder.Property(x => x.SetBy);
    }
}
