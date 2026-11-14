namespace Infrastructure.Bonuses;

public sealed class BonusOptions
{
    public Dictionary<LoyaltyTier, decimal> AccrualPercent { get; set; } = new()
    {
        [LoyaltyTier.Basic] = 1m,
        [LoyaltyTier.Silver] = 3m,
        [LoyaltyTier.Gold] = 5m,
    };
}
