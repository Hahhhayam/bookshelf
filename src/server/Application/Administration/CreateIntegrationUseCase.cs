namespace Application.Administration;

/// <summary>One row per configured connection; several connections may share a kind, such as two payment providers.</summary>
public sealed class CreateIntegrationUseCase(
    IIntegrationRepository integrations, ICurrentUser user, AuditTrail audit, IUnitOfWork unitOfWork)
{
    public async Task<IntegrationId> ExecuteAsync(IntegrationKind kind, string name, CancellationToken ct)
    {
        user.Require(Permissions.IntegrationsManage);
        var integration = Integration.Create(kind, name);
        integrations.Add(integration);
        audit.Record("integration.created", integration.Id.ToString(),
            FieldChange.Set("kind", kind.ToString()), FieldChange.Set("name", integration.Name));
        await unitOfWork.CommitAsync(ct);
        return integration.Id;
    }
}
