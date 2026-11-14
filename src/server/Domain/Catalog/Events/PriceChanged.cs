namespace Domain.Catalog;

/// <summary>Leads to a price history entry, an audit record and a catalog cache refresh.</summary>
public sealed record PriceChanged(
    BookId BookId, Money OldPrice, Money NewPrice, UserId ChangedBy, DateTimeOffset OccurredAt) : IDomainEvent
{
    public Guid EventId { get; } = Guid.CreateVersion7();
}
