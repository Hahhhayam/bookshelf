namespace Domain.Administration;

/// <summary>The locations a user may work in. <see cref="Everywhere"/> covers every location, including ones added later.</summary>
public sealed record LocationAccess(IReadOnlySet<LocationId> Locations, bool Everywhere = false)
{
    public static LocationAccess All { get; } = new(new HashSet<LocationId>(), Everywhere: true);

    public bool Allows(LocationId location) => Everywhere || Locations.Contains(location);
}
