namespace Infrastructure.Persistence.Configurations.ValueObjects;

internal static class ContactInfoMapping
{
    public static void Configure(ComplexPropertyBuilder<ContactInfo> contact)
    {
        contact.Property(x => x.Name).HasMaxLength(200);
        contact.Property(x => x.Phone).HasMaxLength(50);
        contact.Property(x => x.Email).HasMaxLength(256);
    }
}
