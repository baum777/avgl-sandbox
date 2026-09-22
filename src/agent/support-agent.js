import { getCustomer } from '../context/customer-store.js';
import { getOrder } from '../context/order-store.js';
import { planRefund } from './refund-planner.js';
import { loadRefundPolicy } from '../authority/refund-policy.js';
import { evaluateRefundAuthority } from '../authority/approval-gate.js';
import { executeRefund } from '../runtime/refund-executor.js';
import { verifyRefund } from '../verification/refund-verifier.js';

export async function handleRefundRequest({ orderId, requestedAmountEur, reason, approval, provider }) {
  const order = await getOrder(orderId);
  const customer = order ? await getCustomer(order.customerId) : null;
  const proposal = planRefund({ order, requestedAmountEur, reason });

  if (!customer) {
    return {
      order,
      customer,
      proposal,
      authority: { granted: false, mode: 'DENIED', reason: 'CUSTOMER_NOT_FOUND' },
    };
  }

  const policy = await loadRefundPolicy(customer.segment);
  const authority = evaluateRefundAuthority({ proposal, policy, approval });
  const execution = executeRefund({ proposal, authority, provider });
  const verification = verifyRefund({ execution, provider });

  return { order, customer, proposal, policy, authority, execution, verification };
}
