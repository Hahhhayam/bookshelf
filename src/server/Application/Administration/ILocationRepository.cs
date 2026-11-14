namespace Application.Administration;

public interface ILocationRepository
{
    Task<Location?> GetAsync(LocationId id, CancellationToken ct);

    void Add(Location location);
}
