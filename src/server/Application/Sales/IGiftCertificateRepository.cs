namespace Application.Sales;

public interface IGiftCertificateRepository
{
    Task<GiftCertificate?> FindByNumberAsync(string number, CancellationToken ct);
}
