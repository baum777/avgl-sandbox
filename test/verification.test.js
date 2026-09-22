import test from 'node:test';
import assert from 'node:assert/strict';
import { FakePaymentProvider } from '../src/providers/payment-provider.js';
import { executeRefund } from '../src/runtime/refund-executor.js';
import { verifyRefund } from '../src/verification/refund-verifier.js';

test('receipt does not equal verification', () => {
  const provider = new FakePaymentProvider();
  const proposal = { status: 'PROPOSED', orderId: 'order-100', amountEur: 30 };
  const authority = { granted: true, mode: 'AUTO' };
  const execution = executeRefund({ proposal, authority, provider });

  assert.equal(execution.receipt.status, 'accepted');
  assert.equal(verifyRefund({ execution, provider }).verified, false);

  provider.settleRefund(execution.receipt.providerRef);
  assert.equal(verifyRefund({ execution, provider }).verified, true);
});

test('ACT is blocked when MAY is absent', () => {
  const provider = new FakePaymentProvider();
  const proposal = { status: 'PROPOSED', orderId: 'order-100', amountEur: 30 };
  const execution = executeRefund({
    proposal,
    authority: { granted: false, mode: 'DENIED' },
    provider,
  });

  assert.equal(execution.executed, false);
  assert.equal(execution.status, 'BLOCKED');
  assert.equal(verifyRefund({ execution, provider }).verified, false);
});
