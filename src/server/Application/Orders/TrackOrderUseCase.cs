namespace Application.Orders;

/// <summary>
/// Lets a customer follow their order without an account. The pickup code is a random value only they were given,
/// so it serves as the proof of ownership; callers may show the status, contents, total and pickup store, never staff
/// or personal data.
/// </summary>
public sealed class TrackOrderUseCase(IOrderQueries orders)
{
    public Task<OrderView> ExecuteAsync(PickupCode code, CancellationToken ct) =>
        orders.FindByPickupCodeAsync(code, ct).OrNotFound("Order");
}
