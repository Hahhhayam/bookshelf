namespace Application.Crm;

public interface IPromotionRepository
{
    Task<IReadOnlyList<Promotion>> ListActiveAsync(DateTimeOffset at, CancellationToken ct);

    void Add(Promotion promotion);
}
