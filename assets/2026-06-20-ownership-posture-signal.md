# Ownership Posture Signal

Date: 2026-06-20

## Decision

Question Arena should evaluate not only what information the candidate gathers, but what posture their questions reveal.

The same scenario can expose very different candidate modes:

- approval-seeking
- narrow executor
- collaborator
- problem owner

This is often more interesting than raw information count.

## Why

Interview simulations can easily feel like a game. Candidates may feel pressure and fail to show their natural working style. The product should not pretend it perfectly captures someone's "true self."

Instead, the useful signal is more modest and more realistic:

When placed in an ambiguous work situation, what level is the candidate operating at?

## Posture Examples

Approval-seeking:

- asks the manager to approve every small implementation detail
- focuses on button placement, exact UI copy, or permission for every next action
- may be careful, but shows low autonomy

Narrow executor:

- asks implementation-first questions
- treats the vague request as already specified
- optimizes for doing the assigned task rather than understanding the problem

Collaborator:

- asks who the user is, why it matters, what constraints exist, and what tradeoffs the manager cares about
- uses the manager to calibrate direction, not to approve every detail
- plans to resolve lower-level details independently

Problem owner:

- forms and tests hypotheses
- asks about stakeholders, constraints, failure modes, deadlines, and success criteria
- proposes a grounded next immediate step without needing the full picture

## Evaluation Implication

The candidate does not need to collect every hidden fact.

A strong transcript should show:

- useful framing
- adaptive follow-up
- appropriate ownership for the target level
- a next immediate step that follows from earned context

For a new grad role, the target is not "acts like a senior staff engineer." The target is usually collaborator posture: asks enough high-level context to avoid building the wrong thing, then chooses a reasonable next step.

## Demo Implication

Use curated examples instead of over-optimizing the prompt:

- weak run: asks implementation/approval questions and sounds like they need the manager to own the problem
- strong run: asks context/tradeoff questions and sounds like they can own the next step

This makes the demo less about whether the model answered perfectly and more about the candidate signal the system is designed to reveal.
