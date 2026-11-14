namespace Infrastructure.Persistence.Configurations.Inventory;

internal sealed class TransferStatusChangeConfiguration()
    : ChangeConfiguration<TransferStatusChange, TransferId, TransferStatus>(
        "inventory", "TransferStatusChanges", nameof(TransferId));
