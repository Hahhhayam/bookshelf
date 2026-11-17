namespace Application.Crm;

/// <summary>CRM managers keep the segments; marketing aims personal offers at them.</summary>
public sealed class ListSegmentsUseCase(ICrmLists lists, ICurrentUser user)
{
    public Task<IReadOnlyList<Segment>> ExecuteAsync(CancellationToken ct)
    {
        user.RequireAny(Permissions.CrmManage, Permissions.PromotionsManage);
        return lists.SegmentsAsync(ct);
    }
}
