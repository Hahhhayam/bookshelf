using Application.Purchasing;

namespace Infrastructure.Persistence.Repositories.Purchasing;

internal sealed class MissingBookRequestRepository(BookstoreDbContext db) : IMissingBookRequestRepository
{
    public Task<MissingBookRequest?> FindOpenByTitleAsync(string title, CancellationToken ct) =>
        db.Set<MissingBookRequest>().FirstOrDefaultAsync(
            r => r.Status == MissingBookRequestStatus.Open && r.Title.ToLower() == title.ToLower(), ct);

    public void Add(MissingBookRequest request) => db.Set<MissingBookRequest>().Add(request);
}
