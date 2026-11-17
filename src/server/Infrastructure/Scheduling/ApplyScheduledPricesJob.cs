using Application.Catalog;
using Quartz;

namespace Infrastructure.Scheduling;

[DisallowConcurrentExecution]
internal sealed class ApplyScheduledPricesJob(ApplyScheduledPricesUseCase useCase) : IJob
{
    public ValueTask Execute(IJobExecutionContext context, CancellationToken ct) => new(useCase.ExecuteAsync(ct));
}
