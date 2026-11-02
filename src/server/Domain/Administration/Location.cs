namespace Domain.Administration;

/// <summary>A store or warehouse. New locations are added by configuration, without code changes.</summary>
public sealed class Location : AggregateRoot<LocationId>
{
    public string Name { get; private set; }
    public LocationType Type { get; }
    public Address Address { get; private set; }
    public bool IsActive { get; private set; } = true;

    private Location(LocationId id, string name, LocationType type, Address address) : base(id)
    {
        Name = name;
        Type = type;
        Address = address;
    }

    public static Location Create(string name, LocationType type, Address address) =>
        new(LocationId.New(), Guard.NotBlank(name), type, address);

    public void Update(string name, Address address)
    {
        Name = Guard.NotBlank(name);
        Address = address;
    }

    public void Deactivate() => IsActive = false;

    public void Activate() => IsActive = true;
}
