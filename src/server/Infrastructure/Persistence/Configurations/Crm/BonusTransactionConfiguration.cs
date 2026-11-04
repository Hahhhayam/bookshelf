using Domain.Crm;

namespace Infrastructure.Persistence.Configurations.Crm;

internal sealed class BonusTransactionConfiguration : IEntityTypeConfiguration<BonusTransaction>
{
    public void Configure(EntityTypeBuilder<BonusTransaction> builder)
    {
        builder.ToTable($"{nameof(BonusTransaction)}s", "crm");
        builder.HasKey(x => x.Id);
        builder.Property(x => x.Id).ValueGeneratedNever();
        builder.Property<BonusAccountId>(nameof(BonusAccountId));
        builder.HasOne<BonusAccount>().WithMany(a => a.Transactions)
            .HasForeignKey(nameof(BonusAccountId)).OnDelete(DeleteBehavior.Cascade);
        builder.Property(x => x.Kind);
        builder.Property(x => x.Points);
        builder.Property(x => x.SourceDocumentId);
        builder.Property(x => x.At);
    }
}
