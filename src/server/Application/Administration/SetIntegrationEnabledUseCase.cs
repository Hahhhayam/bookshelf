namespace Application.Administration;

public sealed class SetIntegrationEnabledUseCase(
    IIntegrationRepository integrations, ICurrentUser user, AuditTrail audit, IUnitOfWork unitOfWork)
{
    public async Task ExecuteAsync(IntegrationId id, bool enabled, CancellationToken ct)
    {
        user.Require(Permissions.IntegrationsManage);
        var integration = await integrations.GetAsync(id, ct).OrNotFound("Integration");
        var wasEnabled = integration.IsEnabled;
        if (enabled)
            integration.Enable();
        else
            integration.Disable();
        audit.Record(enabled ? "integration.enabled" : "integration.disabled", id.ToString(),
            new FieldChange("enabled", wasEnabled.ToString(), enabled.ToString()));
        await unitOfWork.CommitAsync(ct);
    }
}
