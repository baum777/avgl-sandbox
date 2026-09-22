export const emailCapability = Object.freeze({
  id: 'email-tool',
  operation: 'email.send',
});

export function draftRefundEmail({ customerName, amountEur }) {
  return 'Refund of EUR ' + amountEur.toFixed(2) + ' prepared for ' + customerName + '.';
}
