import { supportsRefund } from '../capabilities/refund-tool.js';

export function evaluateRefundAuthority({ proposal, policy, approval = null }) {
  if (proposal.status !== 'PROPOSED') {
    return { granted: false, mode: 'DENIED', reason: 'NO_VALID_PROPOSAL' };
  }

  if (!supportsRefund(proposal.amountEur) || proposal.amountEur > policy.hardCapabilityLimitEur) {
    return { granted: false, mode: 'DENIED', reason: 'OUTSIDE_CAPABILITY_LIMIT' };
  }

  if (proposal.amountEur <= policy.maxAutoRefundEur) {
    return { granted: true, mode: 'AUTO', policyId: policy.id };
  }

  if (approval?.approved === true && approval?.scope === 'refund.create') {
    return {
      granted: true,
      mode: 'HUMAN_APPROVAL',
      policyId: policy.id,
      approvalId: approval.id,
    };
  }

  return { granted: false, mode: 'APPROVAL_REQUIRED', policyId: policy.id };
}
