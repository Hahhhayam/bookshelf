namespace Application.Purchasing;

public interface IMissingBookRequestRepository
{
    Task<MissingBookRequest?> FindOpenByTitleAsync(string title, CancellationToken ct);

    void Add(MissingBookRequest request);
}
