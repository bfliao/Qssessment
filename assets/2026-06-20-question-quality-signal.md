# Question Quality Signal

Date: 2026-06-20

## Decision

Question Arena should not be positioned as a hidden-fact puzzle where the candidate must uncover every piece of context.

The stronger assessment signal is:

- what the candidate chooses to ask
- what prior experience or mental model the question reveals
- what ownership posture the candidate is operating from
- whether the candidate uses each answer as input for a sharper follow-up
- whether the final next immediate step is grounded in the context they earned

## Why

A generic question like "what is the most important thing I should know?" may earn some useful context, but by itself it does not show much judgment.

A stronger question often exposes a hypothesis or real work experience, for example:

- who is this actually for?
- what changed recently?
- is this tied to a deadline or renewal?
- are there privacy or compliance constraints?
- is the issue segmented by platform, user type, or timing?
- what would make a minimal v1 acceptable?

The answerer's response is not the end goal. It is input for the candidate's next question.

## Evaluation Framing

Keep deterministic weighted information gain as the baseline metric, but evaluate the transcript with three additional lenses:

1. Question quality: does the question reveal a useful hypothesis, risk awareness, stakeholder awareness, or relevant experience?
2. Adaptive follow-up: does the candidate use new information to ask sharper next questions?
3. Ownership posture: is the candidate seeking approval for every detail, executing narrowly, collaborating on tradeoffs, or owning the problem?
4. Grounded next step: does the candidate choose a reasonable immediate action from the context they earned?

## Demo Implication

For the hackathon demo, do not spend too much time perfecting one prompt. Build the pipeline, then use curated examples:

- weak run: generic questions that do not build on answers
- strong run: targeted questions that reveal a working model and lead to a grounded next immediate step

This makes the product easier to explain and avoids overfitting the demo to one prompt behavior.
