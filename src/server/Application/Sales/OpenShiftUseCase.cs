namespace Application.Sales;

/// <summary>The store administrator opens the till (table 1.1 «Контролює зміни»); sales need an open shift.</summary>
public sealed class OpenShiftUseCase(IShiftRepository shifts, ICurrentUser user, IClock clock, IUnitOfWork unitOfWork)
{
    public async Task<ShiftId> ExecuteAsync(LocationId location, CancellationToken ct)
    {
        user.Require(Permissions.ShiftsManage);
        user.RequireAccess(location);
        Guard.That(await shifts.FindOpenAsync(location, ct) is null, "shift-already-open", "A shift is already open at this store.");

        var shift = Shift.Open(location, user.Id, clock.Now);
        shifts.Add(shift);
        await unitOfWork.CommitAsync(ct);
        return shift.Id;
    }
}
