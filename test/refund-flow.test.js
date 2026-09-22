import test from 'node:test';
import assert from 'node:assert/strict';
import { handleRefundRequest } from '../src/agent/support-agent.js';
import { FakePaymentProvider } from '../src/providers/payment-provider.js';
import { verifyRefund } from '../src/verification/refund-verifier.js';

test('default policy automatically authorizes a refund up to EUR 50', async () => {
  const provider = new FakePaymentProvider();
  const result = await handleRefundRequest({
    orderId: 'order-100',
    requestedAmountEur: 30,
    reason: 'damaged item',
    provider,
  });

  assert.equal(result.authority.granted, true);
  assert.equal(result.authority.mode, 'AUTO');
  assert.equal(result.execution.executed, true);
  assert.equal(result.verification.verified, false);

  provider.settleRefund(result.execution.receipt.providerRef);
  assert.equal(verifyRefund({ execution: result.execution, provider }).verified, true);
});

test('refund above the auto limit is blocked without approval', async () => {
  const provider = new FakePaymentProvider();
  const result = await handleRefundRequest({
    orderId: 'order-101',
    requestedAmountEur: 79,
    reason: 'service failure',
    provider,
  });

  assert.equal(result.authority.granted, false);
  assert.equal(result.authority.mode, 'APPROVAL_REQUIRED');
  assert.equal(result.execution.executed, false);
});

test('scoped human approval authorizes the same refund', async () => {
  const provider = new FakePaymentProvider();
  const result = await handleRefundRequest({
    orderId: 'order-101',
    requestedAmountEur: 79,
    reason: 'service failure',
    approval: { id: 'approval-7', approved: true, scope: 'refund.create' },
    provider,
  });

  assert.equal(result.authority.granted, true);
  assert.equal(result.authority.mode, 'HUMAN_APPROVAL');
  assert.equal(result.execution.executed, true);
});
