namespace Application.Administration;

public sealed record CreateLocationCommand(string Name, LocationType Type, Address Address);

/// <summary>New stores and warehouses are added as data, without code changes.</summary>
public sealed class CreateLocationUseCase(
    ILocationRepository locations, ICurrentUser user, AuditTrail audit, IUnitOfWork unitOfWork)
{
    public async Task<LocationId> ExecuteAsync(CreateLocationCommand command, CancellationToken ct)
    {
        user.Require(Permissions.LocationsManage);
        var location = Location.Create(command.Name, command.Type, command.Address);
        locations.Add(location);
        audit.Record("location.created", location.Id.ToString(), FieldChange.Set("name", location.Name),
            FieldChange.Set("type", location.Type.ToString()), FieldChange.Set("address", location.Address.Value));
        await unitOfWork.CommitAsync(ct);
        return location.Id;
    }
}
