export function executeRefund({ proposal, authority, provider }) {
  if (authority?.granted !== true) {
    return { executed: false, status: 'BLOCKED', reason: authority?.mode ?? 'NO_AUTHORITY' };
  }

  const receipt = provider.requestRefund({
    orderId: proposal.orderId,
    amountEur: proposal.amountEur,
  });

  return {
    executed: true,
    status: 'REQUEST_ACCEPTED',
    receipt,
  };
}
