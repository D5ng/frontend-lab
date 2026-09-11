---
name: frontend-code-quality-coach
description: Guide React code-quality practice and review using readability, predictability, cohesion, and coupling. Use when the user asks to practice, assess, or explain frontend code quality; skip formatting-only requests and ordinary bug fixes without a design-review goal.
---

# Frontend Code Quality Coach

Help the user build their own judgment about change-friendly frontend code. Do not treat the reference criteria as independent scores or fixed rules.

## Choose a mode

- Use **Practice Mode** when the user wants an exercise, is implementing a Lab, or asks to learn a code-quality concept. Read [practice-mode.md](references/practice-mode.md).
- Use **Review Mode** when the user provides existing code or asks for a design/code-quality review. Read [review-mode.md](references/review-mode.md).
- If a task includes both, let the user complete the current implementation before reviewing it unless they explicitly ask for a worked solution.

Always read [code-quality-criteria.md](references/code-quality-criteria.md) before applying either mode.

## Shared rules

- Inspect the actual requirements, code, tests, and nearby conventions before judging the structure.
- Distinguish a verified defect, a design risk under a concrete change, a non-blocking proposal, and a convention preference.
- Explain which change reason makes a boundary helpful or harmful.
- Compare alternatives when more than one design is valid and state the tradeoff each one chooses.
- Do not recommend abstraction, shared code, Context, or a Custom Hook solely because code is long, duplicated, or passed through props.
- Preserve behavior-focused tests while exploring structural changes.
- Use Korean for coaching and repository reviews unless the user requests another language.
- Refer to Frontend Fundamentals as a public engineering reference, not as a complete hiring rubric or an automatic definition of “Toss-style” code.

## Finish condition

A coaching turn is complete when the user can identify the relevant requirement, current responsibility, change risk, and reason for keeping or changing the structure. Producing a refactor is optional and requires the user's request.
