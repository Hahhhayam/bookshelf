namespace Application.Crm;

public sealed record RegisterCustomerCommand(ContactInfo Contact, CustomerCard Card);

/// <summary>Cashiers register customers at the till; CRM managers do it in bulk.</summary>
public sealed class RegisterCustomerUseCase(
    ICustomerRepository customers, IBonusAccountRepository accounts, ICurrentUser user, IUnitOfWork unitOfWork)
{
    public async Task<CustomerId> ExecuteAsync(RegisterCustomerCommand command, CancellationToken ct)
    {
        if (!user.Has(Permissions.CrmManage))
            user.Require(Permissions.SalesCreate);
        Guard.That(await customers.FindByCardAsync(command.Card, ct) is null, "card-taken", "This card is already registered.");

        var customer = Customer.Register(command.Contact, command.Card);
        customers.Add(customer);
        accounts.Add(BonusAccount.Open(customer.Id));
        await unitOfWork.CommitAsync(ct);
        return customer.Id;
    }
}
