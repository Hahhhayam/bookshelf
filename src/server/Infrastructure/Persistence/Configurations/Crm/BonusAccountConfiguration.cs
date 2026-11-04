using Domain.Crm;

namespace Infrastructure.Persistence.Configurations.Crm;

internal sealed class BonusAccountConfiguration()
    : AggregateRootConfiguration<BonusAccount, BonusAccountId>("crm", $"{nameof(BonusAccount)}s")
{
    protected override void ConfigureRoot(EntityTypeBuilder<BonusAccount> builder)
    {
        builder.Navigation(x => x.Transactions).AutoInclude();
        builder.Property(x => x.CustomerId);
        builder.HasIndex(x => x.CustomerId).IsUnique();
        builder.Property(x => x.Balance);
    }
}
