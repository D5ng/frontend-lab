# Review Mode

Review before editing unless the user explicitly asks for implementation.

## Evidence pass

1. Read the stated requirements, relevant source, tests, and direct consumers.
2. Describe each important module's current responsibility in one sentence.
3. Identify the source of truth and policies involved.
4. Check observable behavior separately from structural quality.

## Findings

Report the outcome in this order:

1. **Verified defect:** current behavior or contract is already incorrect.
2. **Design risk:** a concrete, plausible requirement change exposes avoidable cost.
3. **Proposal:** an alternative that may improve a chosen quality but is not required now.
4. **Convention:** a consistency preference without correctness impact.

For each material finding include:

- direct code evidence;
- the relevant readability, predictability, cohesion, or coupling criterion;
- why it matters in this repository;
- a change scenario that reveals the cost;
- at least one viable alternative and its tradeoff;
- whether to change now or wait for more evidence.

## Avoid false certainty

- A large component is not automatically multiple responsibilities.
- A Custom Hook is not automatically a clean separation.
- Prop drilling is not automatically harmful when ownership and dependency remain clear.
- Duplicate code is not automatically a missed abstraction.
- A design is not correct merely because it resembles a published example.

If there are no material findings, say so and name the remaining verification limits. Do not invent a suggestion to fill every criterion.
