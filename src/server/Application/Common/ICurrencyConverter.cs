namespace Application.Common;

/// <summary>Adapter for the exchange-rate source; which rate applies (e.g. the central bank's daily one) is its concern.</summary>
public interface ICurrencyConverter
{
    Money Convert(Money amount, CurrencyCode targetCurrency);
}
