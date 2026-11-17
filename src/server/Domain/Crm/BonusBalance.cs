namespace Domain.Crm;

/// <summary>The current number of bonuses; never negative.</summary>
public readonly record struct BonusBalance
{
    public int Points { get; }

    public BonusBalance(int points)
    {
        Guard.That(points >= 0, "bonus-balance-negative", "The bonus balance cannot be negative.");
        Points = points;
    }
}
