export function planRefund({ order, requestedAmountEur, reason }) {
  if (!order || order.status !== 'paid') {
    return { status: 'REJECTED', reason: 'ORDER_NOT_REFUNDABLE' };
  }

  const amountEur = Math.min(requestedAmountEur, order.totalEur);
  return {
    status: 'PROPOSED',
    orderId: order.id,
    amountEur,
    reason,
  };
}
