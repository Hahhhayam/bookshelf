namespace Application.Administration;

/// <summary>A closed location is deactivated instead of deleted, so its documents and stock history stay.</summary>
public sealed class SetLocationActiveUseCase(
    ILocationRepository locations, ICurrentUser user, AuditTrail audit, IUnitOfWork unitOfWork)
{
    public async Task ExecuteAsync(LocationId id, bool active, CancellationToken ct)
    {
        user.Require(Permissions.LocationsManage);
        var location = await locations.GetAsync(id, ct).OrNotFound("Location");
        if (active)
            location.Activate();
        else
            location.Deactivate();
        audit.Record(active ? "location.activated" : "location.deactivated", id.ToString(), after: location.Name);
        await unitOfWork.CommitAsync(ct);
    }
}
