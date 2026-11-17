namespace Application.Crm;

public sealed class ListPromotionsUseCase(ICrmLists lists, ICurrentUser user)
{
    public Task<IReadOnlyList<Promotion>> ExecuteAsync(CancellationToken ct)
    {
        user.Require(Permissions.PromotionsManage);
        return lists.PromotionsAsync(ct);
    }
}
