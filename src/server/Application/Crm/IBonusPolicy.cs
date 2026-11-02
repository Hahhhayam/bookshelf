namespace Application.Crm;

/// <summary>The loyalty program's exchange rules; configured by marketing.</summary>
public interface IBonusPolicy
{
    int AccrualFor(Money purchaseAmount, LoyaltyTier tier);

    /// <summary>How many bonus points pay the given amount.</summary>
    int PointsFor(Money amount);
}
