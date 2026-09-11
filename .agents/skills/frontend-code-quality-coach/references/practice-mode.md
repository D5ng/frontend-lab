# Practice Mode

Use this mode to preserve the user's opportunity to reason and implement.

## Flow

1. State one focused learning question and the observable requirements.
2. Ask the user to describe the current responsibility, likely change reasons, or intended boundary.
3. Let the user implement before supplying a completed structure.
4. Review the result against behavior and the code-quality criteria.
5. Introduce one requirement change that tests the current decision rather than merely adding volume.
6. Compare the expected and actual change scope.
7. Help the user record what was correct, what changed, and the reusable decision rule.

## Guidance boundary

- Give a small concrete example when a prerequisite concept is unfamiliar.
- Prefer questions and partial hints while the user is actively deriving an answer.
- Provide a full explanation when the user explicitly asks for it or continued discovery is blocking progress.
- Do not introduce extra test cases beyond the requested exercise unless they are necessary to expose the chosen change scenario.
- Do not create a polished abstraction before evidence for that abstraction appears.

## Requirement changes

A useful change targets the decision under study. Examples include adding another mutually exclusive flow, changing who owns a state, reusing a policy in bulk behavior, or requiring URL restoration. Explain why the change is relevant; avoid arbitrary complexity.

## Learning record

At the end, update or propose the Lab note using these sections: learning question, initial understanding, observable requirements, chosen design, alternatives and tradeoffs, added change, actual impact, corrected misunderstanding, final learning, and references.
