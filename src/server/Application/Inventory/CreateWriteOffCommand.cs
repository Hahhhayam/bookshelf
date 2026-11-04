namespace Application.Inventory;

public sealed record CreateWriteOffCommand(LocationId Location, WriteOffReason Reason, IReadOnlyList<ItemQuantity> Items);
