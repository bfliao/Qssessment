# Testing Portal MVP Spec

Date: 2026-06-19

## Current Plan

Build a testing portal with:

- Left side: scenario setup and answerer prompt.
- Right side: Q&A runner where a user asks the agent/manager questions.
- Debug side panel: unlocked facts and gatekeeper decision for development.

This is an internal alignment tool, not the final candidate-facing UI.

## Required Inputs

### 1. Scenario Config

The portal needs a place to set different scenarios.

The scenario config should include:

- candidate-facing problem statement
- manager persona
- ambient facts
- hidden decision-critical facts
- unlock triggers
- fact weights
- direct vs hedged knowledge level
- trap assumptions
- ideal final recommendation

### 2. Interview Answer Prompt

The portal needs a place to edit the answerer behavior.

The prompt should define:

- manager tone
- answer granularity
- no handholding
- no proactive full reveal
- how vague vs precise questions are handled
- how to avoid leaking facts not earned by the candidate

## Runtime Flow

1. User selects or edits scenario config.
2. User edits answerer prompt.
3. User clicks Apply.
4. Candidate/Q&A side shows the problem statement and question budget.
5. User asks up to 5 questions.
6. Gatekeeper decides which facts were earned.
7. Persona response answers using approved facts.
8. Debug panel shows unlocked facts and gatekeeper decision.
9. User writes final recommendation.
10. Portal generates weighted information-gain report.

## Implementation Created

Static testing portal:

- `/Users/michelleyilinfeng/Documents/hackerthon/testing-portal/index.html`
- `/Users/michelleyilinfeng/Documents/hackerthon/testing-portal/styles.css`
- `/Users/michelleyilinfeng/Documents/hackerthon/testing-portal/app.js`

It runs locally by opening `index.html` in a browser.

## Included Templates

### NG SWE Scoping Ticket

Prompt:

> Can you add a way for users to download their order history?

Tests whether the candidate clarifies who/why/constraints before implementation.

### NG SWE Debugging Bug

Prompt:

> Some users say their cart is empty when they come back.

Tests whether the candidate isolates variables and avoids anchoring on a recent deploy.

## Important Design Decision

Candidate-facing product should not show unlock progress.

The testing portal can show debug facts because the team needs to tune behavior, but the actual candidate should only see:

- problem statement
- question count
- conversation
- final recommendation input

