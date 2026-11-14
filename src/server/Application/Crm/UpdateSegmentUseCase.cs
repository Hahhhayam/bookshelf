namespace Application.Crm;

public sealed class UpdateSegmentUseCase(ISegmentRepository segments, ICurrentUser user, IUnitOfWork unitOfWork)
{
    public async Task ExecuteAsync(SegmentId id, string name, string? description, CancellationToken ct)
    {
        user.Require(Permissions.CrmManage);
        var segment = await segments.GetAsync(id, ct).OrNotFound("Segment");
        segment.Update(name, description);
        await unitOfWork.CommitAsync(ct);
    }
}
