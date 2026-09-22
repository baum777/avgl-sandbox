# Scenario 01 — Automatic refund

A default customer requests a EUR 30 refund.

Expected story:

`Support Agent -> Order/Customer Context -> Refund Planner -> Refund Tool -> Default Policy -> Refund Executor -> Provider Receipt -> Refund Verifier`

The default policy grants automatic authority because EUR 30 is below the EUR 50 threshold. The provider receipt is not yet verification; verification becomes true only after the provider reports the refund as settled.
