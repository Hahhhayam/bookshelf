using Domain.Crm;
using Infrastructure.Persistence.Configurations.ValueObjects;

namespace Infrastructure.Persistence.Configurations.Crm;

internal sealed class CustomerConfiguration() : AggregateRootConfiguration<Customer, CustomerId>("crm", $"{nameof(Customer)}s")
{
    protected override void ConfigureRoot(EntityTypeBuilder<Customer> builder)
    {
        builder.ComplexProperty(x => x.Contact, ContactInfoMapping.Configure);
        builder.Property(x => x.Tier);
        builder.Property(x => x.Card).HasMaxLength(64).IsRequired();
        builder.HasIndex(x => x.Card).IsUnique();
        builder.Ignore(x => x.Segments);
        builder.Property<HashSet<SegmentId>>("_segments")
            .HasColumnName(nameof(Customer.Segments))
            .HasConversion<ValueSetConverter<SegmentId, Guid>, ValueSetComparer<SegmentId>>();
    }
}
