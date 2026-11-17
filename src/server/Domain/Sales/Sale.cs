namespace Domain.Sales;

public readonly record struct SaleId(Guid Value)
{
    public static SaleId New() => new(Guid.CreateVersion7());
    public override string ToString() => Value.ToString();
}

public sealed class Sale : AggregateRoot<SaleId>
{
    private readonly List<SaleLine> _lines = [];
    private readonly List<Payment> _payments = [];

    public LocationId LocationId { get; }
    public UserId Cashier { get; }
    public CustomerId? CustomerId { get; }
    public IdempotencyKey IdempotencyKey { get; }
    public DateTimeOffset CompletedAt { get; }
    public SaleStatus Status { get; private set; } = SaleStatus.Completed;
    public IReadOnlyList<SaleLine> Lines => _lines;
    public IReadOnlyList<Payment> Payments => _payments;

    /// <summary>Receipt total after discounts.</summary>
    public Money Total { get; }

    // EF Core cannot bind complex-type properties through the constructor, so it materializes via this one.
    private Sale() : base(default) { }

    private Sale(SaleId id, LocationId locationId, UserId cashier, CustomerId? customerId, IdempotencyKey idempotencyKey,
        DateTimeOffset completedAt, Money total) : base(id)
    {
        LocationId = locationId;
        Cashier = cashier;
        CustomerId = customerId;
        IdempotencyKey = idempotencyKey;
        CompletedAt = completedAt;
        Total = total;
    }

    /// <summary>
    /// Confirms a sale. The caller deducts stock in the same transaction (the one transactional exception).
    /// A resent command with the same key must be detected by the caller before this point.
    /// </summary>
    public static Sale Complete(LocationId locationId, UserId cashier, CustomerId? customerId,
        IEnumerable<SaleLine> lines, IEnumerable<Payment> payments, IdempotencyKey key, DateTimeOffset now)
    {
        var lineList = lines.ToList();
        var paymentList = payments.ToList();
        var total = ValidatedTotal(lineList, paymentList);

        var sale = new Sale(SaleId.New(), locationId, cashier, customerId, key, now, total);
        sale._lines.AddRange(lineList);
        sale._payments.AddRange(paymentList);
        sale.Raise(new SaleCompleted(sale.Id, locationId, customerId, sale.SoldItems(), total, now));
        return sale;
    }

    /// <summary>The receipt total after discounts; the till's quote and the sale count it the same way.</summary>
    public static Money TotalOf(IReadOnlyList<SaleLine> lines)
    {
        Guard.That(lines.Count > 0, "lines-empty", "A receipt needs at least one line.");
        return Money.Sum(lines.Select(l => l.Total), lines[0].UnitPrice.Currency);
    }

    /// <summary>Payments add up to the total exactly; cash change is recorded on the payment, not in its amount.</summary>
    public static void EnsurePaymentsCover(Money total, IEnumerable<Money> payments) =>
        Guard.That(Money.Sum(payments, total.Currency) == total, "payments-total-mismatch", "Payments must add up to the receipt total.");

    private static Money ValidatedTotal(IReadOnlyList<SaleLine> lines, IReadOnlyList<Payment> payments)
    {
        var total = TotalOf(lines);
        Guard.That(payments.All(p => p.Status != PaymentStatus.Failed), "payment-failed", "A sale cannot include a failed payment.");
        EnsurePaymentsCover(total, payments.Select(p => p.Amount));
        return total;
    }

    private IReadOnlyList<ItemQuantity> SoldItems() =>
        _lines.Select(l => new ItemQuantity(l.BookId, l.Quantity)).ToList();

    /// <summary>Marks a pending payment as captured once the payment service confirms it.</summary>
    public void ConfirmPayment(Guid paymentId)
    {
        var payment = _payments.FirstOrDefault(p => p.Id == paymentId)
                      ?? throw new DomainException("payment-not-found", "Payment not found.");
        payment.Capture();
    }

    /// <summary>Only a user with the right to cancel may do this.</summary>
    public void Cancel(bool userMayCancel, UserId by, DateTimeOffset now)
    {
        Guard.That(userMayCancel, "sale-cancel-not-permitted", "The user has no right to cancel sales.");
        Guard.That(Status == SaleStatus.Completed, "sale-not-completed", "Only a completed sale can be cancelled.");
        Status = SaleStatus.Cancelled;
        Raise(new SaleCancelled(Id, LocationId,
            _lines.Select(l => new ItemQuantity(l.BookId, l.Quantity)).ToList(), by, now));
    }
}
