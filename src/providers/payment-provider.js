export class FakePaymentProvider {
  #refunds = new Map();
  #sequence = 0;

  requestRefund({ orderId, amountEur }) {
    const providerRef = 'refund-' + (++this.#sequence);
    this.#refunds.set(providerRef, { orderId, amountEur, status: 'pending' });
    return { providerRef, status: 'accepted' };
  }

  settleRefund(providerRef) {
    const record = this.#refunds.get(providerRef);
    if (!record) throw new Error('Unknown provider refund reference');
    this.#refunds.set(providerRef, { ...record, status: 'settled' });
  }

  getRefund(providerRef) {
    return this.#refunds.get(providerRef) ?? null;
  }
}
