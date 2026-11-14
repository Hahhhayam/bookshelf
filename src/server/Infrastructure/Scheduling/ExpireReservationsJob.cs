using Application.Inventory;
using Quartz;

namespace Infrastructure.Scheduling;

[DisallowConcurrentExecution]
internal sealed class ExpireReservationsJob(ExpireReservationsUseCase useCase) : IJob
{
    public ValueTask Execute(IJobExecutionContext context, CancellationToken ct) => new(useCase.ExecuteAsync(ct));
}
