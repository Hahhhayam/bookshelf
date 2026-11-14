using Application.Crm;
using Microsoft.Extensions.Options;

namespace Infrastructure.Bonuses;

internal sealed class ConfiguredBonusPolicy(IOptions<BonusOptions> options, ICurrencyConverter converter) : IBonusPolicy
{
    public int AccrualFor(Money purchaseAmount, LoyaltyTier tier)
    {
        var percent = options.Value.AccrualPercent.GetValueOrDefault(tier);
        return (int)decimal.Floor(ToUah(purchaseAmount) * percent / 100m);
    }

    /// <summary>Rounded up, so a fraction of a point is never given away.</summary>
    public int PointsFor(Money amount) => (int)decimal.Ceiling(ToUah(amount));

    private decimal ToUah(Money money) =>
        money.Currency == CurrencyCode.Uah ? money.Amount : converter.Convert(money, CurrencyCode.Uah).Amount;
}
