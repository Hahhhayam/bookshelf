using Application.Crm;

namespace Infrastructure.Persistence.Repositories.Crm;

internal sealed class SegmentRepository(BookstoreDbContext db) : ISegmentRepository
{
    public Task<Segment?> GetAsync(SegmentId id, CancellationToken ct) =>
        db.Set<Segment>().FirstOrDefaultAsync(s => s.Id == id, ct);

    public void Add(Segment segment) => db.Set<Segment>().Add(segment);
}
