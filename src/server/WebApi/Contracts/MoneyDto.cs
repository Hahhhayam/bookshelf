namespace WebApi.Contracts;

public sealed record MoneyDto(decimal Amount, string Currency)
{
    public Money ToMoney() => new(Amount, Currency);

    public static MoneyDto From(Money money) => new(money.Amount, money.Currency);
}
