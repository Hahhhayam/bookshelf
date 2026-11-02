namespace Domain.Sales;

public readonly record struct ReturnReason
{
    public string Text { get; }

    public ReturnReason(string text) => Text = Guard.NotBlank(text);
}
