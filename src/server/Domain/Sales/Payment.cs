namespace Domain.Sales;

/// <summary>A payment with its method and status. Card details are never stored.</summary>
public sealed class Payment : Entity<Guid>
{
    public PaymentMethod Method { get; }
    public Money Amount { get; }
    public PaymentStatus Status { get; private set; }

    /// <summary>Cash handed back to the customer; zero unless more cash was tendered than paid.</summary>
    public Money Change { get; }

    public Money Tendered => Amount + Change;

    // EF Core cannot bind complex-type properties through the constructor, so it materializes via this one.
    private Payment() : base(default) { }

    public Payment(PaymentMethod method, Money amount, PaymentStatus status, Money? tendered = null)
        : base(Guid.CreateVersion7())
    {
        Guard.That(amount > Money.Zero(amount.Currency), "amount-not-positive", "Payment amount must be positive.");
        Guard.That(tendered is null || method == PaymentMethod.Cash, "tender-not-cash", "Only cash can be tendered with change.");
        var change = tendered is { } cash ? cash - amount : Money.Zero(amount.Currency);
        Guard.That(!change.IsNegative, "tender-insufficient", "Tendered cash cannot be less than the amount paid.");
        Method = method;
        Amount = amount;
        Status = status;
        Change = change;
    }

    internal void Capture() => Status = PaymentStatus.Captured;
}
