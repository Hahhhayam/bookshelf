namespace Application.Crm;

/// <summary>The loyalty program's exchange rules; configured by marketing.</summary>
public interface IBonusPolicy
{
    int AccrualFor(Money purchaseAmount, LoyaltyTier tier);

    /// <summary>How many bonus points pay the given amount.</summary>
    int PointsFor(Money amount);

    /// <summary>The largest amount the given points pay, so that <see cref="PointsFor"/> of it never exceeds them.</summary>
    Money ValueOf(int points, CurrencyCode currency);
}
