namespace Application.Crm;

/// <summary>Keeping the customer base: CRM managers correct a customer's name, phone or e-mail.</summary>
public sealed class UpdateCustomerContactUseCase(ICustomerRepository customers, ICurrentUser user, IUnitOfWork unitOfWork)
{
    public async Task ExecuteAsync(CustomerId id, ContactInfo contact, CancellationToken ct)
    {
        user.Require(Permissions.CrmManage);
        var customer = await customers.GetAsync(id, ct).OrNotFound("Customer");
        customer.UpdateContact(contact);
        await unitOfWork.CommitAsync(ct);
    }
}
