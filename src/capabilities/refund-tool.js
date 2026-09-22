export const refundCapability = Object.freeze({
  id: 'refund-tool',
  operation: 'refund.create',
  maxAmountEur: 500,
});

export function supportsRefund(amountEur) {
  return Number.isFinite(amountEur) && amountEur > 0 && amountEur <= refundCapability.maxAmountEur;
}
