namespace Application.Crm;

public sealed class CreateSegmentUseCase(ISegmentRepository segments, ICurrentUser user, IUnitOfWork unitOfWork)
{
    public async Task<SegmentId> ExecuteAsync(string name, string? description, CancellationToken ct)
    {
        user.Require(Permissions.CrmManage);
        var segment = Segment.Create(name, description);
        segments.Add(segment);
        await unitOfWork.CommitAsync(ct);
        return segment.Id;
    }
}
