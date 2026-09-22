import test from 'node:test';
import assert from 'node:assert/strict';
import { refundCapability } from '../src/capabilities/refund-tool.js';
import { loadRefundPolicy } from '../src/authority/refund-policy.js';
import { evaluateRefundAuthority } from '../src/authority/approval-gate.js';

test('CAN does not imply MAY', async () => {
  const policy = await loadRefundPolicy('default');
  const proposal = { status: 'PROPOSED', orderId: 'order-103', amountEur: 200 };

  assert.equal(refundCapability.maxAmountEur, 500);
  const authority = evaluateRefundAuthority({ proposal, policy });
  assert.equal(authority.granted, false);
  assert.equal(authority.mode, 'APPROVAL_REQUIRED');
});

test('VIP policy explicitly overrides the inherited auto-refund threshold', async () => {
  const policy = await loadRefundPolicy('vip');
  assert.equal(policy.inheritedFrom, 'refund-policy-default');
  assert.equal(policy.maxAutoRefundEur, 100);

  const proposal = { status: 'PROPOSED', orderId: 'order-102', amountEur: 79 };
  const authority = evaluateRefundAuthority({ proposal, policy });
  assert.equal(authority.granted, true);
  assert.equal(authority.mode, 'AUTO');
});
