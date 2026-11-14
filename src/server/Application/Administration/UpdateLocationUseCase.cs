namespace Application.Administration;

public sealed class UpdateLocationUseCase(ILocationRepository locations, ICurrentUser user, IUnitOfWork unitOfWork)
{
    public async Task ExecuteAsync(LocationId id, string name, Address address, CancellationToken ct)
    {
        user.Require(Permissions.LocationsManage);
        var location = await locations.GetAsync(id, ct).OrNotFound("Location");
        location.Update(name, address);
        await unitOfWork.CommitAsync(ct);
    }
}
