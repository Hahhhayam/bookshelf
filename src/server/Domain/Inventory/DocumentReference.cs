namespace Domain.Inventory;

public readonly record struct DocumentReference(DocumentType Type, Guid DocumentId);
