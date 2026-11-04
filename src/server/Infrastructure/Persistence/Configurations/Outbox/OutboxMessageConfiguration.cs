using Infrastructure.Persistence.Outbox;

namespace Infrastructure.Persistence.Configurations.Outbox;

internal sealed class OutboxMessageConfiguration : IEntityTypeConfiguration<OutboxMessage>
{
    public void Configure(EntityTypeBuilder<OutboxMessage> builder)
    {
        builder.ToTable($"{nameof(OutboxMessage)}s", "messaging");
        builder.HasKey(x => x.Id);
        builder.Property(x => x.Id).ValueGeneratedNever();
        builder.Property(x => x.EventType).HasMaxLength(512).IsRequired();
        builder.Property(x => x.Payload).IsRequired();
        builder.Property(x => x.OccurredAt);
        builder.Property(x => x.ProcessedAt);
        builder.HasIndex(x => x.ProcessedAt);
    }
}
