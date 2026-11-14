namespace Application.Common;

/// <summary>
/// Persists every aggregate loaded or added during the use case in one database transaction,
/// after the handlers of the aggregates' domain events have run.
/// </summary>
public interface IUnitOfWork
{
    Task CommitAsync(CancellationToken ct);
}
