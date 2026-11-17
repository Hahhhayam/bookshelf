namespace Domain.Crm;

/// <summary>Minimal contact data; at least one way to reach the customer is required.</summary>
public sealed record ContactInfo
{
    public string Name { get; }
    public string? Phone { get; }
    public string? Email { get; }

    public ContactInfo(string name, string? phone, string? email)
    {
        Guard.That(!string.IsNullOrWhiteSpace(phone) || !string.IsNullOrWhiteSpace(email),
            "contact-required", "A customer needs a phone number or an e-mail.");
        Name = Guard.NotBlank(name);
        Phone = string.IsNullOrWhiteSpace(phone) ? null : phone.Trim();
        Email = string.IsNullOrWhiteSpace(email) ? null : email.Trim();
    }
}
