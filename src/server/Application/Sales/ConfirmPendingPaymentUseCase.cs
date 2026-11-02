namespace Application.Sales;

/// <summary>Called when the payment service later confirms a payment that was Pending at the till.</summary>
public sealed class ConfirmPendingPaymentUseCase(ISaleRepository sales, IUnitOfWork unitOfWork)
{
    public async Task ExecuteAsync(SaleId saleId, Guid paymentId, CancellationToken ct)
    {
        var sale = await sales.GetAsync(saleId, ct).OrNotFound("Sale");
        sale.ConfirmPayment(paymentId);
        await unitOfWork.CommitAsync(ct);
    }
}
