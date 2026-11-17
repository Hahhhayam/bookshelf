namespace Domain.Inventory;

public readonly record struct StockItemId(Guid Value)
{
    public static StockItemId New() => new(Guid.CreateVersion7());
    public override string ToString() => Value.ToString();
}

/// <summary>The stock of one catalog item at one location. Exactly one per location–book pair.</summary>
public sealed class StockItem : AggregateRoot<StockItemId>
{
    private readonly List<Reservation> _reservations = [];
    private readonly List<StockMovement> _movements = [];

    public LocationId LocationId { get; }
    public BookId BookId { get; }
    public Quantity OnHand { get; private set; } = Quantity.Zero;
    public Quantity MinimumStock { get; private set; }
    public IReadOnlyList<Reservation> Reservations => _reservations;
    public IReadOnlyList<StockMovement> Movements => _movements;

    public Quantity Reserved =>
        new(_reservations.Where(r => r.IsActive).Sum(r => r.Quantity.Value));

    public StockLevel Level => new(OnHand, Reserved);

    private StockItem(StockItemId id, LocationId locationId, BookId bookId, Quantity minimumStock) : base(id)
    {
        LocationId = locationId;
        BookId = bookId;
        MinimumStock = minimumStock;
    }

    public static StockItem Open(LocationId locationId, BookId bookId, Quantity minimumStock = default) =>
        new(StockItemId.New(), locationId, bookId, minimumStock);

    public void SetMinimumStock(Quantity minimum) => MinimumStock = minimum;


    public void ReceiveGoods(Quantity quantity, Guid goodsReceiptId, DateTimeOffset now) =>
        Increase(quantity, MovementType.Receipt, new(DocumentType.GoodsReceipt, goodsReceiptId), now);

    public void ReceiveTransfer(Quantity quantity, Guid transferId, DateTimeOffset now) =>
        Increase(quantity, MovementType.TransferIn, new(DocumentType.Transfer, transferId), now);

    public void AcceptReturn(Quantity quantity, Guid returnId, DateTimeOffset now) =>
        Increase(quantity, MovementType.Return, new(DocumentType.Return, returnId), now);


    /// <summary>Deducts sold stock. Reserved goods cannot be sold.</summary>
    public void Sell(Quantity quantity, Guid saleId, DateTimeOffset now) =>
        DecreaseAvailable(quantity, MovementType.Sale, new(DocumentType.Sale, saleId), now);

    public void WriteOff(Quantity quantity, Guid writeOffId, DateTimeOffset now) =>
        DecreaseAvailable(quantity, MovementType.WriteOff, new(DocumentType.WriteOff, writeOffId), now);

    /// <summary>Sets the on-hand quantity manually. Needs a reason and is audited by the caller.</summary>
    public void Adjust(Quantity newOnHand, AdjustmentReason reason, UserId by, Guid documentId, DateTimeOffset now)
    {
        Guard.That(newOnHand >= Reserved, "stock-below-reserved", "On-hand quantity cannot drop below the reserved quantity.");
        var delta = newOnHand.Value - OnHand.Value;
        if (delta == 0)
            return;

        var before = OnHand;
        OnHand = newOnHand;
        _movements.Add(new(MovementType.Adjustment, delta, new(DocumentType.Adjustment, documentId), now, reason, by));
        RaiseIfBelowMinimum(before, now);
    }


    public ReservationId Reserve(Quantity quantity, ReservationPurpose purpose, Guid documentId,
        DateTimeOffset? expiresAt = null)
    {
        Guard.That(!quantity.IsZero, "quantity-not-positive", "Reserved quantity must be positive.");
        Guard.That(quantity <= Level.Available, "stock-insufficient", "Not enough available stock to reserve.");

        var reservation = new Reservation(quantity, purpose, documentId, expiresAt);
        _reservations.Add(reservation);
        return reservation.Id;
    }

    public void ReleaseReservation(ReservationId reservationId) =>
        FindActive(reservationId).Status = ReservationStatus.Released;

    /// <summary>Hands the goods over: the reservation becomes an actual write-off of on-hand stock.</summary>
    public void FulfilReservation(ReservationId reservationId, DateTimeOffset now)
    {
        var reservation = FindActive(reservationId);
        reservation.Status = ReservationStatus.Fulfilled;

        var (type, document) = reservation.Purpose == ReservationPurpose.CustomerOrder
            ? (MovementType.OrderIssue, DocumentType.Order)
            : (MovementType.TransferOut, DocumentType.Transfer);
        var before = OnHand;
        OnHand -= reservation.Quantity;
        _movements.Add(new(type, -reservation.Quantity.Value, new(document, reservation.DocumentId), now));
        RaiseIfBelowMinimum(before, now);
    }

    public int ExpireReservations(DateTimeOffset now)
    {
        var due = _reservations.Where(r => r.IsActive && r.ExpiresAt is { } at && at <= now).ToList();
        due.ForEach(r => r.Status = ReservationStatus.Expired);
        return due.Count;
    }

    public ReservationId? FindActiveReservation(Guid documentId) =>
        _reservations.FirstOrDefault(r => r.IsActive && r.DocumentId == documentId)?.Id;


    private void Increase(Quantity quantity, MovementType type, DocumentReference document, DateTimeOffset now)
    {
        Guard.That(!quantity.IsZero, "quantity-not-positive", "Quantity must be positive.");
        OnHand += quantity;
        _movements.Add(new(type, quantity.Value, document, now));
    }

    private void DecreaseAvailable(Quantity quantity, MovementType type, DocumentReference document, DateTimeOffset now)
    {
        Guard.That(!quantity.IsZero, "quantity-not-positive", "Quantity must be positive.");
        Guard.That(quantity <= Level.Available, "stock-insufficient", "Not enough available stock.");

        var before = OnHand;
        OnHand -= quantity;
        _movements.Add(new(type, -quantity.Value, document, now));
        RaiseIfBelowMinimum(before, now);
    }

    private Reservation FindActive(ReservationId id) =>
        _reservations.FirstOrDefault(r => r.Id == id && r.IsActive)
        ?? throw new DomainException("reservation-not-found", "Active reservation not found.");

    private void RaiseIfBelowMinimum(Quantity before, DateTimeOffset now)
    {
        if (before >= MinimumStock && OnHand < MinimumStock)
            Raise(new StockBelowMinimum(Id, LocationId, BookId, OnHand, MinimumStock, now));
    }
}
