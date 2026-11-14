namespace Application.Crm;

public interface ISegmentRepository
{
    Task<Segment?> GetAsync(SegmentId id, CancellationToken ct);

    void Add(Segment segment);
}
