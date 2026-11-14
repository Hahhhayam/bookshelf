namespace Infrastructure.Persistence.Configurations.ValueObjects;

internal static class DocumentReferenceMapping
{
    public static void Configure(ComplexPropertyBuilder<DocumentReference> document)
    {
        document.Property(x => x.Type);
        document.Property(x => x.DocumentId);
    }
}
