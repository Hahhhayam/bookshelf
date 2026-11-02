namespace Domain.Inventory;

public readonly record struct AdjustmentReason
{
    public string Text { get; }

    public AdjustmentReason(string text) => Text = Guard.NotBlank(text);
}
