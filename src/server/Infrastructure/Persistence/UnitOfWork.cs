namespace Infrastructure.Persistence;

/// <summary>Saves the tracked aggregates; <see cref="DomainEventInterceptor"/> runs their event handlers first.</summary>
public sealed class UnitOfWork(BookstoreDbContext db) : IUnitOfWork
{
    public Task CommitAsync(CancellationToken ct) => db.SaveChangesAsync(ct);
}
