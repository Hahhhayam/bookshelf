namespace Application.Inventory;

/// <summary>A row of the transfer list (scenario 3.11). Unresolved discrepancies are the warning.</summary>
public sealed record TransferSummary(
    TransferId Transfer, Route Route, TransferStatus Status, bool HasOpenDiscrepancies, DateTimeOffset? LastChangedAt,
    UserId? LastChangedBy);
