namespace Application.Inventory;

public sealed record ResolveTransferDiscrepancyCommand(TransferId Transfer, Guid Discrepancy, string Reason);

/// <summary>Scenario 3.7, step 5: a discrepancy raised at receiving is reviewed and closed with its reason.</summary>
public sealed class ResolveTransferDiscrepancyUseCase(
    ITransferRepository transfers, ICurrentUser user, IClock clock, IUnitOfWork unitOfWork)
{
    public async Task ExecuteAsync(ResolveTransferDiscrepancyCommand command, CancellationToken ct)
    {
        user.Require(Permissions.TransfersManage);
        var transfer = await transfers.GetAsync(command.Transfer, ct).OrNotFound("Transfer");
        if (!user.CanAccess(transfer.Route.From))
            user.RequireAccess(transfer.Route.To);

        transfer.ResolveDiscrepancy(command.Discrepancy, command.Reason, user.Id, clock.Now);
        await unitOfWork.CommitAsync(ct);
    }
}
