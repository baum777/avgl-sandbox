# AVGL Sandbox

A deliberately small, deterministic agent system for testing, explaining, and improving **AVGL (Agent Visual Grammar Language)** visualizations.

The repository models one concrete story: a support agent handles refund requests. It is intentionally understandable without domain knowledge while still containing enough structure to exercise identity, context, reasoning, capability, authority, effect, verification, inheritance, override, provenance, and downstream impact.

> This is a visualization and semantics benchmark, not a production payment implementation.

## The system in one minute

~~~text
Customer refund request
        |
        v
Support Agent             WHO
        |
        +--> Order + Customer Context      KNOW
        |
        +--> Refund Planner                THINK
        |
        +--> Refund Tool                   CAN
        |
        +--> Refund Policy / Approval      MAY
        |
        +--> Refund Executor               ACT
        |
        +--> Provider Observation          DID
~~~

The interesting part is not the sequence itself. It is the semantic separation between the relationships.

~~~text
CAN != MAY
ACT != DID
RECEIPT != VERIFICATION
CONTEXT != PERMISSION
CONTAINMENT != INHERITANCE
~~~

## What the visualization should make obvious

Against this sandbox, a useful AVGL projection should let a new viewer answer:

1. Who acts?
2. What context is read?
3. Where is the refund proposal produced?
4. What can the system technically do?
5. What is it actually authorized to do?
6. Where can external state change?
7. How is the intended outcome verified?
8. Which policy is inherited and which field is overridden?
9. Where did an effective property come from?
10. What downstream component can a source artifact affect?

See **benchmark/COMPREHENSION_CHECKLIST.md** for the human-comprehension benchmark.

## Repository map

~~~text
src/
  agent/
    support-agent.js       orchestrates the example flow
    refund-planner.js      creates a refund proposal
  context/
    order-store.js         order context
    customer-store.js      customer context
  capabilities/
    refund-tool.js         technical refund capability (CAN)
    email-tool.js          additional unused capability surface
  authority/
    refund-policy.js       resolves default + VIP policy inheritance
    approval-gate.js       turns policy/approval into authority (MAY)
  runtime/
    refund-executor.js     effect-bearing refund request (ACT)
  verification/
    refund-verifier.js     verifies observed provider outcome (DID)
  providers/
    payment-provider.js    deterministic fake external system

config/
  policy.default.json      default auto-refund limit: EUR 50
  policy.vip.json          inherits default and overrides limit to EUR 100

fixtures/                  bounded customer/order input data
scenarios/                 four semantic benchmark scenarios
test/                      executable invariant tests
benchmark/                 human comprehension benchmark
AGENTS.md                  repository context; intentionally not runtime authority
~~~

## Four benchmark scenarios

### 1. Automatic refund

A default customer requests EUR 30. Policy grants automatic authority, the executor submits the refund, and the provider returns an acceptance receipt. The outcome remains unverified until the provider reports settlement.

### 2. Approval required

A default customer requests EUR 79. The refund capability supports it, but automatic authority stops at EUR 50. Execution stays blocked until a scoped human approval exists.

### 3. Capability without authority

The refund tool can technically create refunds up to EUR 500. That does not mean the agent may autonomously create a EUR 200 refund.

### 4. Receipt without verification

An accepted provider receipt proves that a request was accepted, not that the refund settled. The verifier must observe settled state before reporting a verified outcome.

Detailed scenario notes live in **scenarios/**.

## Inheritance and effective state

The default policy declares:

~~~text
maxAutoRefundEur = 50
~~~

The VIP policy explicitly extends it and overrides only that value:

~~~text
refund-policy-default
        |
        | inherited by
        v
refund-policy-vip
        |
        +-- maxAutoRefundEur = 100
~~~

This gives AVGL a concrete case for distinguishing filesystem containment from semantic inheritance and for tracing provenance of an effective value.

## Run it

Requires Node.js 20+ and no third-party dependencies.

~~~bash
npm test
npm run demo
~~~

The tests make the intended semantics executable:

- CAN != MAY
- ACT != DID
- RECEIPT != VERIFICATION
- authority is required before mutation
- VIP policy inheritance and override remain explicit

## Suggested AVGL projections

### SYSTEM

Show spaces, boundaries, objects, policy inheritance, the runtime boundary, and the provider boundary.

### STORY

Show the human flow:

~~~text
request -> context -> proposal -> capability -> authority -> execution -> verification
~~~

### TRACE

For one EUR 79 refund, explain why execution is blocked or allowed:

~~~text
Refund EUR 79
  |
  +-- CAN: refund tool supports amount
  |
  +-- MAY: default auto limit = EUR 50
  |      +-- approval required
  |
  +-- ACT: blocked until authority exists
~~~

After approval, the trace should continue through execution receipt to independent verification.

## What AVGL should not infer

This repository intentionally contains documentation, filenames, comments, and capability declarations that could tempt a weak analyzer into semantic inflation.

AVGL should not infer that:

- documentation saying a refund is possible means it happened;
- the existence of refund-tool.js grants permission;
- a provider receipt proves the intended outcome;
- files sharing a folder necessarily inherit from each other;
- AGENTS.md gives the runtime agent payment authority.

Unknown relationships should remain unknown until supported by evidence.

## Relationship vocabulary exercised here

The example provides concrete material for relations such as:

~~~text
reads
contributes_to
derives
supports
applies_to
inherits
overrides
grants
invokes
mutates
produces
verifies
~~~

A renderer may choose different visual forms, but the underlying relation meaning should remain typed and evidence-bound.

## Feedback loop

The sandbox is intended to stay stable while AVGL evolves:

~~~text
Sandbox
  -> AVGL analyze
  -> projection
  -> comprehension test
  -> ambiguity / confusion finding
  -> grammar or renderer improvement
  -> re-run the same sandbox
~~~

That makes changes to cards, lenses, relation lineage, context, spatial layout, and evidence presentation comparable against the same small system.
