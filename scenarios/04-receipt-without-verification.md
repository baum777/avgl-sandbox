# Scenario 04 — Receipt without verification

`FakePaymentProvider.requestRefund()` returns a receipt with status `accepted`. The provider's observed refund remains `pending` until settlement.

Expected AVGL distinction:

- ACT: refund request was submitted
- receipt: provider accepted the request
- DID: remains unverified while observed status is pending
- DID becomes verified only after the provider reports `settled`

This scenario exists to make `ACT != DID` and `RECEIPT != VERIFICATION` visible.
