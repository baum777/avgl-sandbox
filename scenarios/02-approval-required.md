# Scenario 02 — Approval required

A default customer requests a EUR 79 refund.

The refund tool can technically handle the amount, but the default policy permits automatic execution only up to EUR 50. Without a scoped `refund.create` approval, the execution path is blocked.

This scenario exists to make the boundary `CAN != MAY` visible.
