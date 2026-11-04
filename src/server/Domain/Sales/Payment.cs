namespace Domain.Sales;

/// <summary>A payment with its method and status. Card details are never stored.</summary>
public sealed class Payment : Entity<Guid>
{
    public PaymentMethod Method { get; }
    public Money Amount { get; }
    public PaymentStatus Status { get; private set; }

    // EF Core cannot bind complex-type properties through the constructor, so it materializes via this one.
    private Payment() : base(default) { }

    public Payment(PaymentMethod method, Money amount, PaymentStatus status) : base(Guid.CreateVersion7())
    {
        Guard.That(amount > Money.Zero(amount.Currency), "Payment amount must be positive.");
        Method = method;
        Amount = amount;
        Status = status;
    }

    internal void Capture() => Status = PaymentStatus.Captured;
}
