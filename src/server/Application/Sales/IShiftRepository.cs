namespace Application.Sales;

public interface IShiftRepository
{
    Task<Shift?> GetAsync(ShiftId id, CancellationToken ct);

    Task<Shift?> FindOpenAsync(LocationId location, CancellationToken ct);

    void Add(Shift shift);
}
