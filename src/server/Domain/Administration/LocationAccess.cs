namespace Domain.Administration;

public sealed record LocationAccess(IReadOnlySet<LocationId> Locations)
{
    public bool Allows(LocationId location) => Locations.Contains(location);
}
