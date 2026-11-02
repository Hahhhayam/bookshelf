namespace Application.Crm;

public interface IBonusAccountRepository
{
    Task<BonusAccount?> FindByCustomerAsync(CustomerId customer, CancellationToken ct);

    void Add(BonusAccount account);
}
