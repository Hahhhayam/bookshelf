namespace Application.Administration;

/// <summary>Called by an integration adapter after a successful exchange, so administrators see the connection works.</summary>
public sealed class ReportIntegrationExchangeUseCase(
    IIntegrationRepository integrations, IClock clock, IUnitOfWork unitOfWork)
{
    public async Task ExecuteAsync(IntegrationId id, CancellationToken ct)
    {
        var integration = await integrations.GetAsync(id, ct).OrNotFound("Integration");
        integration.ReportExchange(clock.Now);
        await unitOfWork.CommitAsync(ct);
    }
}
