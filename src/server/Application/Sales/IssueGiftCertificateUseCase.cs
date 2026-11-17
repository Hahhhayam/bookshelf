namespace Application.Sales;

/// <summary>
/// Puts a sold certificate into circulation under the number printed on it. The customer pays for it at the till
/// like any other payment; this records only the certificate and its balance.
/// </summary>
public sealed class IssueGiftCertificateUseCase(
    IGiftCertificateRepository certificates, ICurrentUser user, AuditTrail audit, IUnitOfWork unitOfWork)
{
    public async Task<GiftCertificateId> ExecuteAsync(string number, Money value, CancellationToken ct)
    {
        user.Require(Permissions.SalesCreate);
        Guard.That(await certificates.FindByNumberAsync(number, ct) is null, "certificate-number-taken", "A certificate with this number exists.");

        var certificate = GiftCertificate.Issue(number, value);
        certificates.Add(certificate);
        audit.Record("gift-certificate.issued", certificate.Number, FieldChange.Set("value", value.ToString()));
        await unitOfWork.CommitAsync(ct);
        return certificate.Id;
    }
}
