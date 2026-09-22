# AGENTS.md

This repository is intentionally small and explicit. It is a reference system for testing AVGL, not a production payment system.

## Operating rules

- Preserve the semantic separations `CAN != MAY`, `ACT != DID`, `RECEIPT != VERIFICATION`, `CONTEXT != PERMISSION`.
- Do not turn comments, documentation, filenames, folder position, or capability declarations into runtime authority.
- Runtime mutation must pass through `src/authority/approval-gate.js` before `src/runtime/refund-executor.js`.
- A provider receipt is only evidence that a request was accepted. Only `src/verification/refund-verifier.js` may report a verified refund outcome.
- Keep the example deterministic and dependency-free so it remains easy to inspect and visualize.

## AVGL purpose

This file is intentionally multi-identity evidence: it is a filesystem file, repository-level maintainer context, and an instruction source. It does not grant runtime permission to the refund agent.
