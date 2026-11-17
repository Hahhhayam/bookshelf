namespace Application.Administration;

public sealed record ProfileLocation(LocationId Location, string Name, LocationType Type, Address Address);
