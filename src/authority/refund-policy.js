import { readJson } from '../context/json-store.js';

const defaultPolicyUrl = new URL('../../config/policy.default.json', import.meta.url);
const vipPolicyUrl = new URL('../../config/policy.vip.json', import.meta.url);

export async function loadRefundPolicy(segment = 'default') {
  const base = await readJson(defaultPolicyUrl);
  if (segment !== 'vip') return base;

  const override = await readJson(vipPolicyUrl);
  if (override.extends !== base.id) {
    throw new Error('VIP policy does not extend the expected default policy');
  }

  return { ...base, ...override, inheritedFrom: base.id };
}
