namespace Application.Inventory;

public sealed record CreateWriteOffCommand(LocationId Location, WriteOffReason Reason, IReadOnlyList<ItemQuantity> Items);

public sealed class CreateWriteOffUseCase(
    IWriteOffRepository writeOffs, StockItemLoader stock, ICurrentUser user, IClock clock, AuditTrail audit,
    IUnitOfWork unitOfWork)
{
    public async Task<WriteOffId> ExecuteAsync(CreateWriteOffCommand command, CancellationToken ct)
    {
        user.Require(Permissions.WriteOffCreate);
        user.RequireAccess(command.Location);

        var writeOff = WriteOff.Create(command.Location, command.Reason, command.Items, user.Id, clock.Now);
        foreach (var line in writeOff.Lines)
        {
            var item = await stock.RequireAsync(command.Location, line.Id, ct);
            item.WriteOff(line.Quantity, writeOff.Id.Value, clock.Now);
        }

        writeOffs.Add(writeOff);
        audit.Record("stock.written-off", writeOff.Id.ToString(), FieldChange.Set("reason", command.Reason.Text));
        await unitOfWork.CommitAsync(ct);
        return writeOff.Id;
    }
}
