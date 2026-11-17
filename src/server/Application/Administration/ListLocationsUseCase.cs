namespace Application.Administration;

/// <summary>Locations are named on documents of every module (transfers, orders, reports), so no permission is required.</summary>
public sealed class ListLocationsUseCase(IAdministrationQueries queries)
{
    public Task<IReadOnlyList<Location>> ExecuteAsync(CancellationToken ct) => queries.LocationsAsync(ct);
}
