using Domain.Catalog;
using Infrastructure.Persistence.Conventions;
using Infrastructure.Persistence.Configurations.ValueObjects;

namespace Infrastructure.Persistence.Configurations.Catalog;

internal sealed class BookConfiguration() : AggregateRootConfiguration<Book, BookId>("catalog", $"{nameof(Book)}s")
{
    protected override void ConfigureRoot(EntityTypeBuilder<Book> builder)
    {
        builder.Property(x => x.Title).HasMaxLength(500).IsRequired();
        builder.ComplexProperty(x => x.Price, MoneyMapping.Configure);
        builder.Property(x => x.Isbn).HasMaxLength(13);
        builder.HasIndex(x => x.Isbn).IsUnique();
        builder.Property(x => x.Barcode).HasMaxLength(64);
        builder.HasIndex(x => x.Barcode);
        builder.Property(x => x.ItemType);
        builder.Property(x => x.Status);
        builder.Property(x => x.PublisherId);
        builder.Property(x => x.CategoryId);
        builder.Ignore(x => x.Authors);
        builder.PrimitiveCollection<List<AuthorId>>("_authors").HasColumnName(nameof(Book.Authors))
            .ElementType().HasConversion<SingleValueConverter<AuthorId, Guid>>();
        builder.Ignore(x => x.IsActive);
    }
}
