namespace Application.Sales;

/// <summary>The customer's bonus balance and how much of the receipt it may pay (scenario 3.5, step 3).</summary>
public sealed record BonusWriteOff(int Balance, Money Allowed);
