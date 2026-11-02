namespace Domain.Crm;

public readonly record struct CustomerCard
{
    public string Number { get; }

    public CustomerCard(string number) => Number = Guard.NotBlank(number);

    public override string ToString() => Number;
}
