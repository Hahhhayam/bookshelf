namespace Domain.Purchasing;

public sealed class Supplier : AggregateRoot<SupplierId>
{
    public string Name { get; private set; }
    public string? ContactInfo { get; private set; }
    public bool IsActive { get; private set; } = true;

    private Supplier(SupplierId id, string name, string? contactInfo) : base(id)
    {
        Name = name;
        ContactInfo = contactInfo;
    }

    public static Supplier Create(string name, string? contactInfo = null) =>
        new(SupplierId.New(), Guard.NotBlank(name), contactInfo);

    public void Update(string name, string? contactInfo)
    {
        Name = Guard.NotBlank(name);
        ContactInfo = contactInfo;
    }

    public void Deactivate() => IsActive = false;

    public void Activate() => IsActive = true;
}
