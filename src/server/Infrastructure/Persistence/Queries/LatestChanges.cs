namespace Infrastructure.Persistence.Queries;

/// <summary>Loads the newest change of each listed parent in one query, for the "last changed" column of a list.</summary>
internal static class LatestChanges
{
    public static async Task<Dictionary<TParentId, TChange>> ForAsync<TChange, TParentId, TValue>(
        IQueryable<TChange> changes, IReadOnlyCollection<TParentId> parents, CancellationToken ct)
        where TChange : Change<TParentId, TValue>
        where TParentId : struct
        where TValue : notnull
    {
        var rows = await changes.AsNoTracking().Where(c => parents.Contains(c.ParentId)).ToListAsync(ct);
        return rows.GroupBy(c => c.ParentId).ToDictionary(g => g.Key, g => g.MaxBy(c => c.At)!);
    }
}
