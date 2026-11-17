namespace Application.Sales;

public sealed class CloseShiftUseCase(IShiftRepository shifts, ICurrentUser user, IClock clock, IUnitOfWork unitOfWork)
{
    public async Task ExecuteAsync(ShiftId shiftId, CancellationToken ct)
    {
        user.Require(Permissions.ShiftsManage);
        var shift = await shifts.GetAsync(shiftId, ct).OrNotFound("Shift");
        user.RequireAccess(shift.LocationId);

        shift.Close(user.Id, clock.Now);
        await unitOfWork.CommitAsync(ct);
    }
}
