namespace Domain.Catalog;

/// <summary>Starts the book's price history with its initial price.</summary>
public sealed record BookAdded(BookId BookId, Money InitialPrice, UserId CreatedBy, DateTimeOffset OccurredAt) : IDomainEvent
{
    public Guid EventId { get; } = Guid.CreateVersion7();
}
