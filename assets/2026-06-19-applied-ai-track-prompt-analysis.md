# Applied AI Track Prompt Analysis

Date: 2026-06-19

## Prompt Summary

The Applied AI track prompt asks:

> What task-level and dataset-level metrics correlate with a model's post-RL performance gain? Why? Where do these metrics sit on the cost-quality Pareto frontier?

The recommended solution path is research-heavy:

1. Pick a small open-source model and benchmark.
2. Partition benchmark/data into cohorts.
3. Run one RL/post-training run per cohort.
4. Measure performance lift.
5. Define cheap task-level and dataset-level metrics.
6. Measure whether those metrics predict lift on held-out cohorts.

The prompt emphasizes:

- first-principles metric design
- rationale for metric choice
- empirical validation
- cost-quality Pareto frontier
- task-level and dataset-level metrics
- post-training / RL literacy

## What This Signals About Judges

This prompt suggests judges may reward projects that:

- define clear primitives
- propose measurable metrics
- justify why those metrics should predict value
- validate the metrics with an experiment
- show a scatter plot or simple correlation
- reason about cost vs predictive quality
- use open-source models / H100s if possible
- avoid vague product claims without measurement

For Question Arena, this means the pitch should not only be:

> We evaluate candidates by their questions.

It should be:

> We define measurable task-level metrics over question trajectories and show why they predict ambiguity-reduction capability.

## Relationship To Question Arena

Question Arena is still a person-capability evaluation product, not a post-RL dataset-quality experiment.

But the track prompt provides a useful structure:

| Prompt Concept | Question Arena Equivalent |
| --- | --- |
| Task T | Work scenario / incident prompt |
| Model M | Candidate or AI agent attempting the scenario |
| Completion y | Candidate question trajectory + final recommendation |
| Verifier V | Hidden-context unlocker + evaluator |
| Reward r | Ambiguity-reduction score |
| Task-level metric | Metrics on one scenario attempt |
| Dataset-level metric | Metrics across scenarios or candidates |
| Post-RL lift | Downstream performance improvement / predictive hiring signal |

## Metrics We Can Define

### Task-Level Metrics

For one candidate on one scenario:

- Context unlocked ratio
- Weighted information gain
- Number of high-priority hidden facts uncovered
- Question precision
- Follow-up adaptivity
- Hypothesis branching
- Evidence-seeking behavior
- Premature anchoring penalty
- Red-herring resistance
- Final recommendation context-use score
- Question efficiency: useful context per question

### Scenario-Level Metrics

For one generated scenario:

- Hidden-context density
- Number of plausible hypotheses
- Number of red herrings
- Critical fact diversity
- Manager realism score
- Unlock trigger coverage
- Difficulty score
- Discrimination score between strong and weak candidates

### Dataset-Level Metrics

Across many scenarios:

- Scenario diversity
- Skill coverage
- Role coverage
- Average ambiguity level
- Redundancy
- Difficulty distribution
- Signal separation between strong/weak candidates

## Cheap vs Expensive Metrics

Cheap metrics:

- number of questions
- token length
- keyword overlap with hidden facts
- count of unlocked facts
- count of categories touched

Medium-cost metrics:

- LLM-judged question precision
- LLM-judged follow-up adaptivity
- LLM-judged hypothesis quality
- hidden-fact unlock classification

Expensive metrics:

- human manager review
- pairwise comparison of candidates
- repeated attempts across scenarios
- calibration against real hiring outcomes
- post-training models on collected trajectories

## Possible Hackathon Alignment Upgrade

If the team wants stronger alignment with the prompt without pivoting:

1. Define Question Arena primitives.
2. Define task-level metrics over candidate question trajectories.
3. Run a small experiment:
   - create weak, medium, strong candidate trajectories
   - score them with our metrics
   - compare metric ranking to human/team ranking
4. Show a cost-quality table:
   - cheap keyword/unlock metric
   - LLM judge metric
   - human manager metric
5. Explain why weighted information gain should predict candidate quality.

This gives the demo a research/evaluation backbone while preserving the product.

## Pivot Risk

Fully pivoting into the prompt's recommended RL experiment is risky:

- requires model serving and RL setup
- requires multiple training runs
- requires benchmark/eval pipeline
- may consume most of the 24 hours
- may produce weak demo if experiments fail

Question Arena is more product-demo friendly.

Recommended compromise:

> Keep Question Arena, but present it as a metric-driven evaluation environment with clear primitives, task-level metrics, and a small validation experiment.

## Best Framing Update

Old:

> Question Arena evaluates whether candidates ask the right questions.

Stronger:

> Question Arena defines task-level metrics over question trajectories to measure ambiguity reduction: how efficiently a candidate extracts hidden decision-critical context from a realistic work scenario.

Most track-aligned:

> We treat candidate evaluation as a verifier problem. Given a scenario with hidden state, a candidate produces a question trajectory and final recommendation. Our verifier scores information gain, adaptivity, anchoring resistance, and decision relevance, producing a cheap capability signal that can be compared against human manager judgment.

