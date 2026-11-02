namespace Shared;

public readonly record struct GiftCertificateId(Guid Value)
{
    public static GiftCertificateId New() => new(Guid.CreateVersion7());
    public override string ToString() => Value.ToString();
}
