# Execution Plan: Compute, Model Serving, and Team Workstreams

Date: 2026-06-19

## Current Situation

The overall product architecture is stable enough to start implementation.

Current product:

> Company context -> generated scenario -> manager review -> candidate assessment -> ambiguity-reduction evaluation report.

The team should now split work so people do not duplicate effort.

## Compute Context

Public event information says:

- Each accepted team gets 8x H100s.
- Prime Intellect is providing $100 in compute credits.
- Prime Intellect is supporting the hackathon compute.

Public Prime Intellect docs suggest their normal compute flow is:

- create GPU pods/instances
- SSH into the pod
- optionally share the instance with team members
- use custom templates/Docker images
- filter availability by GPU type, including H100_80GB

Exact hackathon-specific delivery is still unknown until organizers provide instructions.

## Compute Decision

Agreed direction:

> Do not block product development on H100/model-serving setup.

Implementation implication:

- Build website and prompts so they can call any OpenAI-compatible endpoint.
- Start with API-backed model calls if needed.
- Run a parallel infra spike to serve an open model on H100s.
- If H100 setup works, swap the endpoint.
- If H100 setup fails or is slow, demo still works.

## Model Serving Direction

Recommended first serving target:

> vLLM / OpenAI-compatible server with a strong open model.

Why:

- Fast to integrate with a web app.
- OpenAI-compatible API reduces frontend/backend changes.
- Can be swapped with external APIs during development.

Candidate models to test:

- Qwen 2.5 / Qwen 3 instruct model
- Llama instruct model
- DeepSeek distilled model
- Any model preloaded or recommended by the hackathon compute environment

Do not do:

- heavy training
- complicated distributed serving
- custom inference engine work
- full RL or post-training before MVP works

## Endpoint Abstraction

All product code should call one internal model wrapper:

```txt
generateEnvironmentResponse(input) -> response + unlockedFacts
generateEvaluationReport(input) -> report
generateScenario(input) -> scenario
```

Behind that wrapper, the provider can be:

- Claude/OpenAI-style external API
- local vLLM endpoint
- Prime Intellect-hosted endpoint
- mocked response for demos

This prevents model-serving work from blocking frontend/product work.

## Team Workstreams

### Workstream 1: Product Website / Demo Flow

Goal:

Build the visible website flow.

Owns:

- fake company persona selector
- company context preview
- generate assessment button
- manager review screen
- candidate assessment screen
- final report screen

Deliverable:

Clickable website demo that works with mocked model responses first.

Success condition:

Someone can run through the whole story without backend/model serving being finished.

### Workstream 2: Scenario + Prompt + Evaluation Logic

Goal:

Define the actual assessment intelligence.

Owns:

- fake company persona
- messy initial problem statement
- hidden context map
- unlock triggers
- environment prompt
- question classifier prompt
- scoring rubric
- final report prompt

Deliverable:

One excellent scenario that makes strong vs weak questioning visibly different.

Success condition:

Given five candidate questions, the system can show what context was unlocked, what was missed, and why.

### Workstream 3: Model Serving / Compute Spike

Goal:

Figure out the H100 serving path without blocking the rest of the team.

Owns:

- confirm how hackathon provides 8x H100s
- get SSH/dashboard access
- verify `nvidia-smi`
- install or use existing vLLM/server stack
- download/test one open model
- expose an OpenAI-compatible endpoint
- document endpoint URL and auth/env vars

Deliverable:

One working model endpoint or a clear fallback decision.

Success condition:

The website can call a model endpoint through the internal wrapper.

### Workstream 4: Demo Script / QA / Fallbacks

Goal:

Make sure the final presentation lands.

Owns:

- 90-second demo script
- strong and weak candidate sample runs
- fallback screenshots/video
- seed data for deterministic demo
- copywriting/pitch language
- final QA

Deliverable:

Reliable demo path even if live model calls fail.

Success condition:

The team can present the core insight clearly under time pressure.

## Immediate Next Steps

### First 30-60 Minutes

1. Product/website owner starts UI skeleton with mocked data.
2. Scenario/prompt owner finalizes one fake company persona and hidden context map.
3. Infra owner checks Prime Intellect/hackathon compute instructions and tests access.
4. Demo owner writes the first 90-second demo script and collects sample candidate trajectories.

### Before Deep Model Work

Make sure these are already true:

- website can run locally
- scenario exists as JSON
- question limit works
- hidden facts can be unlocked manually or with mock logic
- final report screen exists

Model serving should improve the demo, not define whether it exists.

## Fallback Strategy

If H100/vLLM setup works:

- Use open model endpoint for environment responses and report generation.
- Mention H100 inference as part of the technical story.

If H100/vLLM setup is delayed:

- Use external API or mocked responses.
- Keep the H100 work as a parallel technical bonus.
- Do not sacrifice the product demo.

If live model responses are unstable:

- Use seeded strong/weak candidate trajectories.
- Precompute one evaluation report.
- Run only one live question in demo.

## What Must Be In The Final Product

Must-have features:

- Company context creates a scenario.
- Manager can review/approve the scenario.
- Candidate asks limited questions.
- Good questions unlock hidden context.
- Candidate gives final recommendation.
- System outputs an evidence-backed ambiguity-reduction report.

Nice-to-have features:

- Multiple personas
- Time pressure
- Real shareable link
- Live scenario regeneration
- H100-served open model
- Candidate comparison mode

## Architecture Rule

Keep product and model serving loosely coupled.

The website should not care whether the model is:

- Claude
- OpenAI
- vLLM
- Prime Intellect endpoint
- mocked JSON

This lets the team ship the product while infrastructure work runs in parallel.

