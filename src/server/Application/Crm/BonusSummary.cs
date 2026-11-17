namespace Application.Crm;

/// <summary>What the shop may show a buyer about their loyalty program: tier and bonuses, no personal data.</summary>
public sealed record BonusSummary(LoyaltyTier Tier, BonusAccount? Account);
