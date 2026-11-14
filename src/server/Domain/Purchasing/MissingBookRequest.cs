namespace Domain.Purchasing;

public readonly record struct MissingBookRequestId(Guid Value)
{
    public static MissingBookRequestId New() => new(Guid.CreateVersion7());
    public override string ToString() => Value.ToString();
}

/// <summary>A recorded demand for an item the chain does not have, so it can be ordered later.</summary>
public sealed class MissingBookRequest : AggregateRoot<MissingBookRequestId>
{
    public string Title { get; }
    public string? Author { get; }
    public LocationId LocationId { get; }
    public CustomerId? CustomerId { get; }
    public int Demand { get; private set; } = 1;
    public MissingBookRequestStatus Status { get; private set; } = MissingBookRequestStatus.Open;
    public DateTimeOffset RecordedAt { get; }

    private MissingBookRequest(MissingBookRequestId id, string title, string? author, LocationId locationId,
        CustomerId? customerId, DateTimeOffset recordedAt) : base(id)
    {
        Title = title;
        Author = author;
        LocationId = locationId;
        CustomerId = customerId;
        RecordedAt = recordedAt;
    }

    public static MissingBookRequest Record(string title, string? author, LocationId locationId,
        CustomerId? customerId, DateTimeOffset now) =>
        new(MissingBookRequestId.New(), Guard.NotBlank(title), author, locationId, customerId, now);

    public void RecordAnotherRequest()
    {
        Guard.That(Status == MissingBookRequestStatus.Open, "The request is no longer open.");
        Demand++;
    }

    public void MarkOrdered() => Status = MissingBookRequestStatus.Ordered;

    public void Close() => Status = MissingBookRequestStatus.Closed;
}
