namespace Domain.Catalog;

/// <summary>Leads to an audit record and a catalog cache refresh.</summary>
public sealed record PriceChanged(
    BookId BookId, Money OldPrice, Money NewPrice, DateTimeOffset ValidFrom, UserId ChangedBy,
    DateTimeOffset OccurredAt) : IDomainEvent
{
    public Guid EventId { get; } = Guid.CreateVersion7();
}
