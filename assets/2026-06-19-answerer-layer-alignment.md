# Answerer Layer Alignment

Date: 2026-06-19

Purpose:

Define the MVP contract for the part Michelle is exploring: given a storyline/scenario in some form, design the answerer that simulates the real-work Q&A environment.

## Current Ownership

Michelle's current scope:

> Build / specify the answerer layer.

Teammate's current scope:

> Come up with the scenario / storyline.

Collaboration point:

> The teammate's storyline must be converted into a scenario config that the answerer can consume.

## Key Product Decision

The answerer is not a generic chatbot.

It is:

> A warm but busy manager persona who answers exactly what the candidate asks, with realistic granularity, without handholding or revealing the full answer.

This manager is not rude or adversarial. The target may include NG / early-career candidates, so the tone should be kind and interview-appropriate.

The signal comes from answer granularity, not attitude.

## Candidate Experience

During the assessment, the candidate sees only:

- problem statement
- question counter, e.g. `5 questions left`
- conversation history
- final recommendation input

Candidate should not see:

- hidden fact count
- total number of facts
- unlock progress
- missed context
- rubric
- answer key

Reason:

If the candidate sees `4/8 facts unlocked`, the system turns into a hidden-object game and leaks the existence of missing context.

## Runtime Design

The answerer should be two-stage:

### Stage 1: Gatekeeper

The gatekeeper decides what the candidate's question has earned.

It should output:

- question classification
- matched hidden facts
- unlocked fact ids
- ambient facts to mention
- whether the question was broad, targeted, sharp, irrelevant, or scattershot
- short rationale for debugging/evaluation

The gatekeeper is the scoring source of truth.

### Stage 2: Persona Response

The persona turns the gatekeeper output into a natural answer from the manager.

The persona can vary wording, but cannot reveal hidden facts that the gatekeeper did not unlock.

This gives the team both:

- stable scoring
- natural-feeling conversation

## Why Two Stages

The product needs some room for realistic dialogue, but the score cannot be an LLM vibe check.

Two-stage design solves this:

- Gatekeeper: deterministic or tightly controlled, auditable.
- Persona: natural, warm, human-like.

If the persona accidentally volunteers extra information, it should not count as unlocked unless the gatekeeper marked it as earned.

Better implementation:

> The persona should only receive facts that the gatekeeper has approved for this turn.

## Scenario Config Contract

Regardless of how the teammate writes the storyline, it should compile into this structure.

```json
{
  "id": "scenario_id",
  "title": "Short scenario title",
  "candidatePrompt": "What the candidate sees",
  "role": "Target role / level",
  "persona": {
    "name": "Manager name",
    "role": "Engineering manager / product lead / founder",
    "tone": "warm, concise, busy, not adversarial",
    "answerStyle": "answers exactly what is asked; does not connect all dots"
  },
  "ambientFacts": [
    {
      "id": "launch_date",
      "fact": "The feature launched three weeks ago.",
      "whenToReveal": ["launch", "timeline", "when did this start"]
    }
  ],
  "hiddenFacts": [
    {
      "id": "example_fact",
      "title": "Short label",
      "fact": "Decision-critical hidden context",
      "category": "scope / user / technical / privacy / deadline / stakeholder",
      "weight": 1.0,
      "knowledgeLevel": "direct | hedged",
      "unlockTriggers": ["keywords or semantic directions"],
      "requiresSpecificity": true,
      "sampleResponse": "What the manager can say when this is unlocked",
      "whyItMatters": "How this fact changes the final recommendation"
    }
  ],
  "trapAssumptions": [
    {
      "id": "obvious_but_wrong",
      "assumption": "The tempting wrong framing",
      "whyTempting": "Why a candidate might anchor on it",
      "howToDisprove": "What question would test it"
    }
  ],
  "idealRecommendation": "What a strong candidate should recommend after earning context",
  "scoring": {
    "primaryMetric": "weighted_information_gain",
    "maxQuestions": 5
  }
}
```

## Ambient Facts

Add boring true facts that unlock nothing.

Why:

Real conversations include mundane facts. If every answer is a hidden-fact unlock, the system feels gamey.

Examples:

- launch date
- team size
- rough volume
- product area
- tech stack
- who reported the issue

Ambient facts should make the world feel real but not change the core decision.

## Hidden Facts

A hidden fact earns its place only if:

> Not knowing it would make the candidate recommend the wrong thing or miss a critical risk.

Cut trivia.

Each hidden fact should change:

- scope
- priority
- user target
- implementation path
- risk level
- deadline
- stakeholder tradeoff
- diagnosis

## Unlock Rules

Recommended rules:

1. Vague question -> shallow true answer, no hidden fact unlock.
2. Targeted question -> unlock relevant fact if it asks in the right direction.
3. Sharp question -> unlock fact with richer detail.
4. Scattershot mega-question -> broad answer only; do not unlock many facts at once.
5. Keyword mention alone is insufficient if the question does not ask why it matters.
6. Wrong assumption -> manager can answer truthfully but does not automatically correct the full framing.

Example:

Bad:

> "Should this be CSV or PDF?"

This mentions format but may not unlock the true need if the candidate has not asked who/why.

Good:

> "Who is asking for this export, and what job are they using it for?"

This can unlock user + use case because it targets the decision-critical context.

## Manager Knowledge Levels

Use two knowledge levels for MVP:

### Direct

The manager knows it clearly and states it plainly when asked precisely.

Example:

> "This is for corporate catering accounts. They need it for expense reports."

### Hedged

The manager knows it secondhand or outside their direct ownership.

They still reveal the fact when asked, but with natural uncertainty.

Example:

> "Legal mentioned masking addresses and card info. You'd want to confirm the exact rule with them."

Do not use "manager does not know" for MVP unless the product supports multiple sources. With one persona, unanswerable facts complicate scoring.

## Tone Decision

Locked:

> Kind, concise, busy, not prickly.

Do not implement:

- rude pushback
- adversarial interview style
- "why are you asking me that?"
- intentionally hostile behavior

Implement:

- short answers
- no over-explaining
- no proactive synthesis
- no automatic rescue
- warm phrasing

## Scoring Decision

Primary score:

> Weighted information gain.

Formula:

```txt
score = sum(weights of unlocked hidden facts) / sum(weights of all earnable hidden facts)
```

Important:

- Ambient facts do not score.
- Persona wording does not score.
- Hidden facts unlock only through gatekeeper decision.
- Final recommendation can be displayed, but MVP scoring should be driven by earned context.

## Good vs Bad Candidate Expectation

Good candidate:

- asks who/why before how
- scopes before building
- tests obvious assumptions
- asks about constraints
- follows up on prior answers
- separates symptom from root cause
- makes a recommendation using earned context

Bad candidate:

- jumps to implementation details
- accepts the literal ticket
- asks vague catch-all questions
- asks scattered mega-questions
- anchors on the obvious explanation
- gives a polished answer without earning context

## Scenario Direction Options

### Recommended MVP Scenario: NG SWE Scoping Ticket

Why:

- Fair for early-career candidates.
- Easy for judges to understand.
- Tests real junior engineering behavior.
- Strong candidates stand out by clarifying before building.

Example prompt:

> "Can you add a way for users to download their order history? Swamped today, thanks."

Hidden decision-critical facts might include:

- It is for corporate catering accounts, not all consumers.
- The use case is expense reporting.
- CSV is needed, not a pretty UI.
- Deadline is tied to a renewal next month.
- Only about 50 accounts need it.
- PII must be masked.

Trap:

> Candidate assumes this is a general consumer "download my data" feature and overbuilds.

### Alternate Scenario: NG SWE Debugging Bug

Example prompt:

> "Some users say their cart is empty when they come back. Can you look into it?"

Hidden decision-critical facts might include:

- Only iOS is affected.
- Only guest users are affected.
- It happens after the app is backgrounded for 30+ minutes.
- Recent UI release is a tempting but wrong culprit.
- Root cause is session/cache expiry.

Trap:

> Candidate anchors on the recent deploy and recommends rollback.

## What Michelle Needs From Teammate

Ask teammate for a storyline in any form, but make sure it contains:

1. Candidate-facing vague prompt.
2. Target role and level.
3. The busy manager persona.
4. 5-8 hidden decision-critical facts.
5. 3-5 ambient facts.
6. One obvious-but-wrong trap assumption.
7. Ideal final recommendation.
8. Which facts are direct vs hedged.
9. Why each hidden fact changes the decision.

If they only provide a story, Michelle can convert it into the config.

## What Michelle Can Build Now

Even before final scenario is ready:

1. Implement answerer wrapper:

```txt
answerQuestion(scenarioConfig, conversationHistory, candidateQuestion)
```

2. Implement gatekeeper output:

```json
{
  "classification": "broad | targeted | sharp | irrelevant | scattershot",
  "unlockedFactIds": [],
  "ambientFactIds": [],
  "shouldAnswerWith": "short instruction to persona",
  "rationale": "debug only"
}
```

3. Implement persona response:

```txt
managerResponse = persona(gatekeeperOutput, approvedFactsOnly)
```

4. Implement state:

```txt
questionsRemaining
unlockedFactIds
conversationHistory
```

5. Implement final info gain score.

## Minimal Demo Output

At the end, report:

- label: Strong / Medium / Weak ambiguity reducer
- information gain score
- hidden facts uncovered
- important missed facts
- strongest question
- weakest question
- final recommendation summary

## Current Recommendation

For alignment, build against the NG SWE scoping-ticket scenario first.

It is easier to explain than the AI-interview drop-off scenario and better fits early-career / NG assessment.

The AI-interview scenario can remain useful as a more senior product/strategy scenario.

