namespace Application.Inventory;

public sealed record TransferView(Transfer Transfer, IReadOnlyList<TransferStatusChange> History);
