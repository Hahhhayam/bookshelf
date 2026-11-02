namespace Application.Administration;

/// <summary>Called by an integration adapter once its retries are exhausted.</summary>
public sealed class ReportIntegrationFailureUseCase(
    IIntegrationRepository integrations, IClock clock, IUnitOfWork unitOfWork)
{
    public async Task ExecuteAsync(IntegrationId id, string error, CancellationToken ct)
    {
        var integration = await integrations.GetAsync(id, ct).OrNotFound("Integration");
        integration.ReportFailure(error, clock.Now);
        await unitOfWork.CommitAsync(ct);
    }
}
