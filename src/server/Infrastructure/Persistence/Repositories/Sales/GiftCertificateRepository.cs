using Application.Sales;

namespace Infrastructure.Persistence.Repositories.Sales;

internal sealed class GiftCertificateRepository(BookstoreDbContext db) : IGiftCertificateRepository
{
    public Task<GiftCertificate?> FindByNumberAsync(string number, CancellationToken ct) =>
        db.Set<GiftCertificate>().FirstOrDefaultAsync(c => c.Number == number, ct);

    public void Add(GiftCertificate certificate) => db.Set<GiftCertificate>().Add(certificate);
}
