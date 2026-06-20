# Question Arena Product Spec

Date: 2026-06-19

## Working Name

Question Arena

Alternative names:

- ContextIQ
- Ambiguity Arena
- InquiryRank
- SignalBeforeAnswer

## One-Line Pitch

Most hiring tools grade answers. Question Arena grades whether a candidate knows what context to earn before answering.

## Core Thesis

In AI-era hiring, polished answers are cheap. The scarce skill is knowing what to ask.

Top candidates stand out under ambiguity. They identify missing context, ask high-leverage questions, test assumptions, uncover hidden constraints, and use that context to make better decisions.

Question Arena evaluates this capability by placing candidates inside realistic ambiguous work scenarios. Candidates have a limited number of questions to extract hidden decision-critical context before making a final recommendation.

## Capability Being Measured

Question Arena measures:

> Can this person reduce ambiguity under realistic work conditions?

This is not a generic AI interview, resume screen, or take-home assignment. It is an inquiry-based work simulation.

## Primary User

Hiring teams, talent marketplaces, or startup teams that need better signals for top-tier candidates.

Secondary users:

- Candidates practicing case interviews or take-home project scoping.
- AI model evaluators testing whether models can ask useful clarifying questions.
- Teams comparing human vs model ambiguity reduction ability.

## MVP Delivery Format

The current delivery should be a website.

The website should prioritize a live, judge-friendly demo over a complete product. The demo needs to make the core signal visible within 90 seconds.

## 90-Second Demo Storyboard

1. Landing state shows one ambiguous work scenario.

   Example:

   > Your company launched an AI interview product three weeks ago. Candidate drop-off is much higher than expected. You have been asked to diagnose the issue and recommend what the team should do next.

2. Candidate is told:

   > You may ask 5 questions before making your recommendation.

3. Candidate asks questions one by one.

4. The AI environment responds, but it does not reveal all context upfront.

   Rules:

   - Vague questions get vague answers.
   - Precise diagnostic questions reveal deeper context.
   - Irrelevant questions reveal little.
   - Hidden facts remain hidden unless asked about.
   - Wrong assumptions may be answered, but the system does not rescue the candidate.

5. A live panel shows which hidden context areas have been unlocked.

   Example:

   - Senior candidate drop-off: unlocked
   - Latency issue: missed
   - Recruiter trust issue: unlocked
   - Generic interview questions: unlocked
   - AI answer cheating risk: missed

6. Candidate gives a final recommendation.

7. System generates an evaluation report:

   - Information gain: 5/8 critical facts uncovered
   - Question precision: high
   - Adaptive follow-up: medium
   - Missed risks: latency, AI answer tools
   - Final recommendation quality: strong
   - Overall signal: strong ambiguity reducer

8. Optional judge moment:

   Compare Candidate A and Candidate B on the same scenario.

   Candidate A asks broad questions and uncovers 2/8 facts.

   Candidate B asks targeted questions and uncovers 6/8 facts.

   The contrast makes the product obvious.

## Website Screens

### Screen 1: Scenario Setup

Purpose:

Show the candidate the ambiguous workplace scenario and the constraints.

Required UI:

- Scenario title
- Scenario description
- Question limit, default 5
- Start button
- Small note: "Your goal is to uncover the context needed to make a good decision."

Do not show the hidden context on this screen.

### Screen 2: Question Arena

Purpose:

Let the candidate ask limited questions and see environment responses.

Required UI:

- Chat-style conversation
- Remaining questions counter
- Input box for candidate question
- Submit question button
- Side panel with progress:
  - Context unlocked count
  - Key areas discovered
  - Key areas still hidden, shown only as generic categories if needed
- Button to move to final recommendation after 5 questions or earlier

Important behavior:

The environment should answer like a realistic workplace source, not like a fully helpful assistant.

### Screen 3: Final Recommendation

Purpose:

Candidate writes the final diagnosis and recommendation.

Required UI:

- Textarea for final recommendation
- Submit for evaluation button
- Summary of discovered facts, but not undiscovered facts

### Screen 4: Evaluation Report

Purpose:

Make the candidate capability signal visible.

Required UI:

- Overall score
- Label, e.g. "Strong Ambiguity Reducer"
- Breakdown:
  - Information gain
  - Question precision
  - Follow-up quality
  - Hypothesis quality
  - Constraint discovery
  - Final decision relevance
- Hidden context map:
  - Unlocked facts
  - Missed critical facts
- Evidence quotes:
  - Best candidate question
  - Weakest or wasted question
  - Most important unlocked fact
- One-paragraph hiring-style assessment

### Optional Screen 5: Compare Two Candidates

Purpose:

Make the demo stronger for judges.

Required UI:

- Side-by-side candidate trajectories
- Context uncovered comparison
- Final recommendation comparison
- System judgment:
  - "Candidate B showed stronger ambiguity reduction because..."

This can be hardcoded for demo if needed.

## Core Scenario for MVP

Use one strong scenario rather than many weak scenarios.

### Scenario

Your company launched an AI interview product three weeks ago. Candidate drop-off is much higher than expected. The CEO asks you to diagnose the issue and recommend what to do next.

You have 5 questions before making your recommendation.

### Hidden Context Facts

Each hidden fact should have:

- id
- title
- full fact
- importance weight
- unlock triggers
- category

Suggested hidden facts:

1. Senior candidates are dropping off most.
   - Category: user segment
   - Weight: high
   - Unlock triggers: seniority, segment, role type, who is dropping off

2. Drop-off spikes after the third AI response.
   - Category: product behavior
   - Weight: high
   - Unlock triggers: where in flow, step, timing, funnel, stage

3. Latency increases after the third turn.
   - Category: technical issue
   - Weight: medium/high
   - Unlock triggers: latency, response time, performance, logs

4. Interview questions are generic and not role-specific.
   - Category: evaluation quality
   - Weight: high
   - Unlock triggers: question quality, role relevance, personalization

5. Candidates do not understand how they are being evaluated.
   - Category: trust/UX
   - Weight: high
   - Unlock triggers: candidate feedback, transparency, trust, perception

6. Recruiters only receive summary scores without evidence.
   - Category: employer trust
   - Weight: medium/high
   - Unlock triggers: recruiter workflow, output, evidence, score trust

7. Some candidates use AI tools to generate polished answers.
   - Category: signal integrity
   - Weight: medium
   - Unlock triggers: cheating, AI assistance, authenticity, answer quality

8. Strong candidates try to ask clarifying questions, but the product ignores them.
   - Category: product mismatch
   - Weight: very high
   - Unlock triggers: candidate questions, clarification, interaction design, senior feedback

### Ideal Candidate Diagnosis

The issue is not only drop-off. The product is failing to create trust and role-relevant signal for high-quality candidates.

Senior candidates are leaving because the AI interviewer feels generic, opaque, and unable to respond to clarifying questions. Latency worsens the experience, but the deeper problem is evaluation design. The team should segment the funnel, fix latency, add role-specific context, support candidate clarification, and make evidence visible to recruiters.

## AI Environment Behavior

The environment should use the hidden facts as ground truth.

When a candidate asks a question:

1. Classify the question:
   - irrelevant
   - broad
   - somewhat targeted
   - highly targeted

2. Decide whether it unlocks a hidden fact.

3. Respond naturally, revealing only what is justified by the question.

4. If a fact is unlocked, mark it as discovered.

5. If the question is broad, answer broadly and encourage no extra help.

Example:

Candidate asks:

> What is the drop-off rate?

Response:

> Overall completion dropped from 72 percent in beta to 49 percent after launch.

Unlock:

- Possibly basic funnel context only. Do not reveal seniority pattern unless asked.

Candidate asks:

> Is drop-off concentrated by candidate seniority, role type, or interview stage?

Response:

> Yes. The largest drop-off is among senior engineering and product candidates, especially after the third AI response.

Unlock:

- Senior candidate drop-off
- Drop-off after third response

## Scoring Rubric

### 1. Information Gain

Measures how many weighted hidden facts the candidate uncovered.

Possible formula:

weighted_unlocked_facts / total_weighted_facts

### 2. Question Precision

Measures whether questions are specific, diagnostic, and grounded in the scenario.

Low:

- "What happened?"
- "What do users think?"

High:

- "Is drop-off concentrated by candidate seniority, role type, or funnel stage?"
- "Do we have candidate feedback about trust, transparency, or perceived fairness?"

### 3. Adaptive Follow-Up

Measures whether the candidate builds on previous answers.

Low:

- Each question is independent.

High:

- Candidate follows a clue into a sharper diagnostic direction.

### 4. Hypothesis Quality

Measures whether questions imply a useful causal model.

Example high-quality hypothesis:

> Is this a trust issue, a performance issue, or a role-relevance issue?

### 5. Constraint Discovery

Measures whether the candidate uncovers:

- affected user segment
- stage of failure
- technical constraints
- stakeholder trust
- UX expectations
- signal integrity risks

### 6. Final Decision Relevance

Measures whether the final recommendation uses the context the candidate discovered.

Important:

Do not give a high final score for a good generic answer if the candidate failed to earn the context.

## Output Expectations

The final website should make these things obvious:

1. The candidate had limited questions.
2. The scenario had hidden context.
3. The AI did not reveal everything by default.
4. Good questions unlocked better context.
5. The system evaluated the candidate's inquiry process, not just the final answer.
6. The output is an evidence-backed capability report.

## MVP Implementation Notes

This can be prompt-based. No pretraining is required for the hackathon MVP.

Recommended architecture:

- Frontend website with local state.
- One scenario JSON object with hidden facts.
- One API route for environment response.
- One API route for final evaluation.
- Optional localStorage for demo persistence.

The first version can hardcode:

- one scenario
- one hidden context graph
- one evaluation rubric
- one comparison example

The value is in the product mechanic and demo clarity, not breadth.

## Non-Goals for MVP

Do not build:

- account system
- resume upload
- full hiring workflow
- job board integration
- many scenarios
- voice interface
- real-time video
- model leaderboard
- heavy pretraining
- complicated database

## If There Is Extra Time

Add one of these, in order:

1. Candidate comparison mode.
2. Scenario editor for hiring managers.
3. Human override for scoring.
4. Exportable evaluation report.
5. Model-vs-human mode, where an AI agent also plays the candidate and asks questions.

## Demo Script

Opening:

> In AI-era hiring, answers are cheap. We wanted to evaluate the harder skill: can this person figure out what context matters before they answer?

Show scenario:

> The candidate gets a vague workplace problem and only five questions.

Show weak question:

> If they ask vague questions, the environment gives vague answers.

Show strong question:

> If they ask targeted questions, they unlock hidden decision-critical context.

Show report:

> We score information gain, question precision, follow-up quality, and whether the final recommendation uses the context they earned.

Close:

> This turns an implicit manager signal into a measurable hiring signal: ambiguity reduction under realistic work conditions.

## Best Single Sentence

Question Arena evaluates how well candidates reduce ambiguity by asking the right questions before they answer.

