namespace Infrastructure.Notifications;

public sealed class SmtpOptions
{
    public string Host { get; set; } = "localhost";
    public int Port { get; set; } = 25;
    public bool UseSsl { get; set; }
    public string? Username { get; set; }
    public string? Password { get; set; }
    public string From { get; set; } = "bookstore@localhost";

    /// <summary>Receives chain-level staff notifications and those of locations without their own address.</summary>
    public string? ChainStaffAddress { get; set; }

    public Dictionary<Guid, string> LocationStaffAddresses { get; set; } = [];
}
