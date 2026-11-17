namespace Application.Crm;

/// <summary>Marketing's lists: promotions to review and segments to aim offers at.</summary>
public interface ICrmLists
{
    /// <summary>Newest first, ended ones included.</summary>
    Task<IReadOnlyList<Promotion>> PromotionsAsync(CancellationToken ct);

    Task<IReadOnlyList<Segment>> SegmentsAsync(CancellationToken ct);
}
