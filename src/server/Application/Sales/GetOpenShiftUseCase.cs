namespace Application.Sales;

/// <summary>The till and the cashier's home show whether the store's till is open.</summary>
public sealed class GetOpenShiftUseCase(IShiftRepository shifts, ICurrentUser user)
{
    public Task<Shift?> ExecuteAsync(LocationId location, CancellationToken ct)
    {
        user.RequireAny(Permissions.SalesCreate, Permissions.ShiftsManage);
        user.RequireAccess(location);
        return shifts.FindOpenAsync(location, ct);
    }
}
