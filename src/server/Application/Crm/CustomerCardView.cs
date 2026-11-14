namespace Application.Crm;

/// <summary>FR-14 customer card: contact, tier, bonus balance with its operations, and purchase history.</summary>
public sealed record CustomerCardView(Customer Customer, BonusAccount? Bonuses, IReadOnlyList<PurchaseSummary> Purchases);
