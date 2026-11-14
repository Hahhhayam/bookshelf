namespace Infrastructure.Exchange;

/// <summary>Stand-in for the exchange-rate source: fixed rates for ten popular currencies (National Bank of Ukraine official rates of 2026-11-12), converting through UAH. Replace before real payments.</summary>
internal sealed class StubCurrencyConverter : ICurrencyConverter
{
    private static readonly Dictionary<CurrencyCode, decimal> UahPerUnit = new()
    {
        [CurrencyCode.Uah] = 1m,
        [new("USD")] = 45.3222m,
        [new("EUR")] = 50.4823m,
        [new("GBP")] = 60.3568m,
        [new("PLN")] = 11.4678m,
        [new("CHF")] = 54.6778m,
        [new("CAD")] = 31.8659m,
        [new("AUD")] = 31.1204m,
        [new("JPY")] = 0.285m,
        [new("CNY")] = 6.7947m,
        [new("CZK")] = 2.0712m,
    };

    public Money Convert(Money amount, CurrencyCode targetCurrency)
    {
        var uah = amount.Amount * RateOf(amount.Currency);
        return new Money(uah / RateOf(targetCurrency), targetCurrency);
    }

    private static decimal RateOf(CurrencyCode currency) =>
        UahPerUnit.TryGetValue(currency, out var rate)
            ? rate
            : throw new NotImplementedException($"The stub converter has no rate for {currency}.");
}
