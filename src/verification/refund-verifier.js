export function verifyRefund({ execution, provider }) {
  if (execution?.executed !== true || !execution.receipt?.providerRef) {
    return { verified: false, reason: 'NO_EXECUTED_REFUND' };
  }

  const observed = provider.getRefund(execution.receipt.providerRef);
  if (!observed || observed.status !== 'settled') {
    return { verified: false, reason: 'OUTCOME_NOT_SETTLED', observed };
  }

  return {
    verified: true,
    outcome: 'REFUND_SETTLED',
    providerRef: execution.receipt.providerRef,
    observed,
  };
}
