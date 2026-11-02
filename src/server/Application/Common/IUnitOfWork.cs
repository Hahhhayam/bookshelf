namespace Application.Common;

/// <summary>
/// Persists every aggregate loaded or added during the use case in one database transaction
/// and writes the aggregates' domain events to the transactional outbox in that same transaction.
/// </summary>
public interface IUnitOfWork
{
    Task CommitAsync(CancellationToken ct);
}
