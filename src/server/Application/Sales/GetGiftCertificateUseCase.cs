namespace Application.Sales;

/// <summary>The remaining balance before a certificate pays at the till (table 2.7 «контроль залишку»).</summary>
public sealed class GetGiftCertificateUseCase(IGiftCertificateRepository certificates, ICurrentUser user)
{
    public async Task<GiftCertificate> ExecuteAsync(string number, CancellationToken ct)
    {
        user.Require(Permissions.SalesCreate);
        return await certificates.FindByNumberAsync(Guard.NotBlank(number), ct).OrNotFound("Gift certificate");
    }
}
