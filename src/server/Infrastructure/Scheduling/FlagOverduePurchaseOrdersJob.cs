using Application.Purchasing;
using Quartz;

namespace Infrastructure.Scheduling;

[DisallowConcurrentExecution]
internal sealed class FlagOverduePurchaseOrdersJob(FlagOverduePurchaseOrdersUseCase useCase) : IJob
{
    public ValueTask Execute(IJobExecutionContext context, CancellationToken ct) => new(useCase.ExecuteAsync(ct));
}
