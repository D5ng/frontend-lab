# Code quality criteria

Use these criteria together. A decision that improves one can weaken another, so relate every judgment to the current requirements and likely changes.

Primary sources:

- [좋은 코드를 위한 4가지 기준](https://frontend-fundamentals.com/code-quality/code/)
- [toss/frontend-fundamentals](https://github.com/toss/frontend-fundamentals)

## Readability

Ask how much context a reader must hold at once and whether the execution flow follows the order in which it is read.

Useful signals:

- branches that never run together are interleaved;
- details obscure the user-level operation;
- a name hides or contradicts the actual behavior;
- an abstraction forces more jumping than the detail it hides.

Do not equate shorter code, more functions, or fewer conditionals with better readability.

## Predictability

Ask whether collaborators can infer behavior from names, inputs, outputs, and nearby conventions.

Useful signals:

- similar functions use incompatible return or error contracts;
- an innocent-looking call changes hidden state;
- the same name means different things in neighboring modules;
- a component requires undocumented ordering or environmental assumptions.

Do not reject a locally clear contract only because another popular library uses a different convention.

## Cohesion

Ask whether code that must change together is structurally kept together.

Useful signals:

- one policy is manually repeated across consumers;
- a form's field, validation, and request transformation can drift independently;
- a single requirement change requires remembering unrelated locations;
- a shared concept has a stable reason to change.

Do not group code merely because it has the same domain noun or looks similar today.

## Coupling

Ask whether the impact of a change is narrow and predictable.

Useful signals:

- a low-level module knows a page or user flow;
- a consumer must provide information irrelevant to its own responsibility;
- changing one variant forces edits to unrelated variants;
- a shared abstraction exposes many switches for unrelated use cases.

Do not assume duplication always means harmful coupling. Local duplication can preserve independent change.

## Tradeoff prompts

- If duplicated code is unified, which future changes become safer and which consumers become tied together?
- If a component is split, which context becomes easier to understand and which full flow becomes harder to trace?
- If state moves upward or into Context, who gains access and which dependencies become less visible?
- If a condition receives a name, does the name express a stable policy or merely hide syntax?
