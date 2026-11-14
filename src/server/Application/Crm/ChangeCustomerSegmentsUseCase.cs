namespace Application.Crm;

/// <summary>Sets the customer's segments to exactly the given ones, for personal offers and analysis.</summary>
public sealed class ChangeCustomerSegmentsUseCase(
    ICustomerRepository customers, ISegmentRepository segments, ICurrentUser user, IUnitOfWork unitOfWork)
{
    public async Task ExecuteAsync(CustomerId customerId, IReadOnlySet<SegmentId> wanted, CancellationToken ct)
    {
        user.Require(Permissions.CrmManage);
        var customer = await customers.GetAsync(customerId, ct).OrNotFound("Customer");
        foreach (var segment in wanted)
            await segments.GetAsync(segment, ct).OrNotFound("Segment");

        foreach (var segment in customer.Segments.Except(wanted).ToList())
            customer.LeaveSegment(segment);
        foreach (var segment in wanted)
            customer.JoinSegment(segment);
        await unitOfWork.CommitAsync(ct);
    }
}
