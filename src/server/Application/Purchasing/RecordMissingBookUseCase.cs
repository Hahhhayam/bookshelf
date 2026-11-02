namespace Application.Purchasing;

public sealed record RecordMissingBookCommand(string Title, string? Author, LocationId Location, CustomerId? Customer);

/// <summary>Repeated requests for the same missing title increase its demand instead of creating duplicates.</summary>
public sealed class RecordMissingBookUseCase(
    IMissingBookRequestRepository requests, ICurrentUser user, IClock clock, IUnitOfWork unitOfWork)
{
    public async Task<MissingBookRequestId> ExecuteAsync(RecordMissingBookCommand command, CancellationToken ct)
    {
        user.Require(Permissions.SalesCreate);
        user.RequireAccess(command.Location);

        var request = await requests.FindOpenByTitleAsync(command.Title, ct);
        if (request is null)
            request = Open(command);
        else
            request.RecordAnotherRequest();

        await unitOfWork.CommitAsync(ct);
        return request.Id;
    }

    private MissingBookRequest Open(RecordMissingBookCommand command)
    {
        var request = MissingBookRequest.Record(command.Title, command.Author, command.Location, command.Customer, clock.Now);
        requests.Add(request);
        return request;
    }
}
