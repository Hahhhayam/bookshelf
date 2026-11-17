namespace Application.Purchasing;

public interface IMissingBookRequestQueries
{
    /// <summary>Requests still waiting to be ordered, most demanded first.</summary>
    Task<IReadOnlyList<MissingBookRequest>> ListOpenAsync(LocationId location, CancellationToken ct);
}
