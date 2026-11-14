namespace Infrastructure.Scheduling;

/// <param name="ExpireReservationsEvery">How late a manual hold may end past its expiry.</param>
/// <param name="FlagOverduePurchaseOrdersEvery">Expected dates are whole days, so a short interval only repeats the same check.</param>
public sealed record ScheduledJobsOptions(
    TimeSpan? ExpireReservationsEvery = null, TimeSpan? FlagOverduePurchaseOrdersEvery = null)
{
    public TimeSpan ExpireReservationsInterval => ExpireReservationsEvery ?? TimeSpan.FromMinutes(1);
    public TimeSpan FlagOverduePurchaseOrdersInterval => FlagOverduePurchaseOrdersEvery ?? TimeSpan.FromHours(1);
}
