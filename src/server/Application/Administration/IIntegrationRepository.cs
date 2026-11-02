namespace Application.Administration;

public interface IIntegrationRepository
{
    Task<Integration?> GetAsync(IntegrationId id, CancellationToken ct);
}
