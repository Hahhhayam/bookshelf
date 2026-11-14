using Application.Orders;
using Domain.Orders;

namespace Infrastructure.Orders;

/// <summary>Written without hyphens: the 32 characters are exactly what the pickup code column holds.</summary>
internal sealed class GuidPickupCodeGenerator : IPickupCodeGenerator
{
    public PickupCode Next() => new(Guid.NewGuid().ToString("N"));
}
