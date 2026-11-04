namespace Application.Crm;

public sealed record RegisterCustomerCommand(ContactInfo Contact, CustomerCard Card);
