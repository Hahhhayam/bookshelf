namespace Domain.Sales;

public sealed class GiftCertificate : AggregateRoot<GiftCertificateId>
{
    public string Number { get; }
    public Money Balance { get; private set; }

    // EF Core cannot bind complex-type properties through the constructor, so it materializes via this one.
    private GiftCertificate() : base(default) { Number = null!; }

    private GiftCertificate(GiftCertificateId id, string number, Money balance) : base(id)
    {
        Number = number;
        Balance = balance;
    }

    public static GiftCertificate Issue(string number, Money value)
    {
        Guard.That(value > Money.Zero(value.Currency), "A certificate must have a positive value.");
        return new(GiftCertificateId.New(), Guard.NotBlank(number), value);
    }

    /// <summary>A purchase cannot spend more than the remaining balance.</summary>
    public void Redeem(Money amount)
    {
        Guard.That(amount > Money.Zero(amount.Currency), "Redeemed amount must be positive.");
        Guard.That(amount <= Balance, "The certificate balance is not enough.");
        Balance -= amount;
    }
}
