namespace Application.Inventory;

public sealed record CreateTransferCommand(Route Route, IReadOnlyList<ItemQuantity> Items);
