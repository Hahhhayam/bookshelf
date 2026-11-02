namespace Domain.Crm;

public sealed class BonusAccount : AggregateRoot<BonusAccountId>
{
    private readonly List<BonusTransaction> _transactions = [];

    public CustomerId CustomerId { get; }
    public BonusBalance Balance { get; private set; } = new(0);
    public IReadOnlyList<BonusTransaction> Transactions => _transactions;

    private BonusAccount(BonusAccountId id, CustomerId customerId) : base(id) => CustomerId = customerId;

    public static BonusAccount Open(CustomerId customerId) => new(BonusAccountId.New(), customerId);

    /// <summary>
    /// Accrues bonuses after a completed sale. Events are delivered at least once,
    /// so a repeated accrual for the same sale is ignored and reported as false.
    /// </summary>
    public bool Accrue(int points, SaleId saleId, DateTimeOffset now)
    {
        Guard.That(points > 0, "Accrued bonuses must be positive.");
        if (Has(BonusTransactionKind.Accrual, saleId.Value))
            return false;

        Balance = new(Balance.Points + points);
        _transactions.Add(new(BonusTransactionKind.Accrual, points, saleId.Value, now));
        return true;
    }

    /// <summary>Spends bonuses during a sale; the balance can never go negative.</summary>
    public void Redeem(int points, SaleId saleId, DateTimeOffset now)
    {
        Guard.That(points > 0, "Redeemed bonuses must be positive.");
        Guard.That(points <= Balance.Points, "Not enough bonuses.");

        Balance = new(Balance.Points - points);
        _transactions.Add(new(BonusTransactionKind.Redemption, -points, saleId.Value, now));
    }

    /// <summary>
    /// Takes back bonuses accrued for a returned sale. Takes at most the current balance
    /// and returns the points actually taken; a repeated reversal for the same return takes nothing.
    /// </summary>
    public int Reverse(int points, ReturnId returnId, DateTimeOffset now)
    {
        Guard.That(points > 0, "Reversed bonuses must be positive.");
        if (Has(BonusTransactionKind.Reversal, returnId.Value))
            return 0;

        var taken = Math.Min(points, Balance.Points);
        Balance = new(Balance.Points - taken);
        _transactions.Add(new(BonusTransactionKind.Reversal, -taken, returnId.Value, now));
        return taken;
    }

    private bool Has(BonusTransactionKind kind, Guid sourceId) =>
        _transactions.Any(t => t.Kind == kind && t.SourceDocumentId == sourceId);
}
