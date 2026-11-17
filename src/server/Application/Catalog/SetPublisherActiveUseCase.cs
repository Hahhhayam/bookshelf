namespace Application.Catalog;

/// <summary>Reference data is deactivated instead of deleted, so books keep pointing at it.</summary>
public sealed class SetPublisherActiveUseCase(
    IPublisherRepository publishers, ICurrentUser user, AuditTrail audit, IUnitOfWork unitOfWork)
{
    public async Task ExecuteAsync(PublisherId id, bool active, CancellationToken ct)
    {
        user.Require(Permissions.CatalogEdit);
        var publisher = await publishers.GetAsync(id, ct).OrNotFound("Publisher");
        var wasActive = publisher.IsActive;
        if (active)
            publisher.Activate();
        else
            publisher.Deactivate();
        audit.Record(active ? "publisher.activated" : "publisher.deactivated", id.ToString(),
            new FieldChange("active", wasActive.ToString(), active.ToString()));
        await unitOfWork.CommitAsync(ct);
    }
}
