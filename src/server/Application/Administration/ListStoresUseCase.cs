namespace Application.Administration;

/// <summary>
/// Public: the online shop offers these for pickup (FR-07). Active stores only, since a customer cannot collect an
/// order at a warehouse or a closed store.
/// </summary>
public sealed class ListStoresUseCase(IAdministrationQueries queries)
{
    public async Task<IReadOnlyList<Location>> ExecuteAsync(CancellationToken ct) =>
        (await queries.LocationsAsync(ct)).Where(l => l.Type == LocationType.Store && l.IsActive).ToList();
}
