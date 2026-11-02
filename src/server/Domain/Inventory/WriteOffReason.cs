namespace Domain.Inventory;

public readonly record struct WriteOffReason
{
    public string Text { get; }

    public WriteOffReason(string text) => Text = Guard.NotBlank(text);
}
