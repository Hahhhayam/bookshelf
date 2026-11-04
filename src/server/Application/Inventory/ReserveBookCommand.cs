namespace Application.Inventory;

public sealed record ReserveBookCommand(LocationId Location, BookId Book, Quantity Quantity, TimeSpan HoldFor);
