using Application.Sales;

namespace Infrastructure.Persistence.Repositories.Sales;

internal sealed class ShiftRepository(BookstoreDbContext db) : IShiftRepository
{
    public Task<Shift?> GetAsync(ShiftId id, CancellationToken ct) =>
        db.Set<Shift>().FirstOrDefaultAsync(s => s.Id == id, ct);

    public Task<Shift?> FindOpenAsync(LocationId location, CancellationToken ct) =>
        db.Set<Shift>().FirstOrDefaultAsync(s => s.LocationId == location && s.ClosedAt == null, ct);

    public void Add(Shift shift) => db.Set<Shift>().Add(shift);
}
