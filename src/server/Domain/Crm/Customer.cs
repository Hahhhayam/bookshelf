namespace Domain.Crm;

public sealed class Customer : AggregateRoot<CustomerId>
{
    private readonly HashSet<SegmentId> _segments = [];

    public ContactInfo Contact { get; private set; }
    public LoyaltyTier Tier { get; private set; } = LoyaltyTier.Basic;
    public CustomerCard Card { get; }
    public IReadOnlyCollection<SegmentId> Segments => _segments;

    private Customer(CustomerId id, ContactInfo contact, CustomerCard card) : base(id)
    {
        Contact = contact;
        Card = card;
    }

    public static Customer Register(ContactInfo contact, CustomerCard card) => new(CustomerId.New(), contact, card);

    public void UpdateContact(ContactInfo contact) => Contact = contact;

    public void ChangeTier(LoyaltyTier tier) => Tier = tier;

    public void JoinSegment(SegmentId segmentId) => _segments.Add(segmentId);

    public void LeaveSegment(SegmentId segmentId) => _segments.Remove(segmentId);
}
