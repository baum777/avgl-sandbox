import { handleRefundRequest } from '../src/agent/support-agent.js';
import { FakePaymentProvider } from '../src/providers/payment-provider.js';
import { verifyRefund } from '../src/verification/refund-verifier.js';

async function run() {
  const provider = new FakePaymentProvider();

  const automatic = await handleRefundRequest({
    orderId: 'order-100',
    requestedAmountEur: 30,
    reason: 'damaged item',
    provider,
  });

  console.log('AUTO', automatic.authority.mode, automatic.execution.status, automatic.verification.verified);
  provider.settleRefund(automatic.execution.receipt.providerRef);
  console.log('AUTO_VERIFIED', verifyRefund({ execution: automatic.execution, provider }).verified);

  const blocked = await handleRefundRequest({
    orderId: 'order-101',
    requestedAmountEur: 79,
    reason: 'service failure',
    provider,
  });
  console.log('APPROVAL_REQUIRED', blocked.authority.mode, blocked.execution.status);

  const approved = await handleRefundRequest({
    orderId: 'order-101',
    requestedAmountEur: 79,
    reason: 'service failure',
    approval: { id: 'approval-1', approved: true, scope: 'refund.create' },
    provider,
  });
  console.log('APPROVED', approved.authority.mode, approved.execution.status);
}

run();
