# Question Arena Decision Log

Date: 2026-06-19

Purpose:

Capture the core discussions, decisions, open questions, and implementation implications for the hackathon project so the team can build without re-litigating the product direction.

## Current Project Direction

Working direction:

> Question Arena: a company-context-driven candidate assessment system that evaluates whether a candidate can reduce ambiguity under realistic work conditions.

Core product loop:

> Company context -> generated scenario -> manager review/edit -> candidate assessment link -> candidate asks limited questions -> system evaluates ambiguity reduction.

Core candidate-side mechanic:

> The candidate receives a vague work scenario with hidden decision-critical context. They have a limited number of questions to uncover that context before making a recommendation. The system evaluates what they asked, what context they unlocked, what they missed, and whether their final answer used the earned context.

## Agreed Decisions

### 1. Core Capability To Evaluate

Agreed:

> We are evaluating whether a person can reduce ambiguity under realistic work conditions.

This is the main capability signal, not generic intelligence, resume quality, or interview polish.

Implementation implication:

- The UI and report should repeatedly make ambiguity reduction visible.
- The score should not only judge the final answer.
- Candidate questions are first-class evidence.

### 2. Core Thesis

Agreed:

> In AI-era hiring, answers are cheap. The scarce skill is knowing what to ask.

Implementation implication:

- The candidate must ask questions before answering.
- The product should emphasize question trajectory and context extraction.
- Do not frame this as another AI interviewer.

### 3. Differentiation From AI Interviewers

Agreed:

Most AI interview products:

> AI asks candidate questions -> candidate answers -> AI scores answers.

Question Arena:

> Candidate asks questions -> system reveals context based on question quality -> system scores inquiry process and final judgment.

Implementation implication:

- The system should not behave like a normal helpful chatbot.
- It should not proactively reveal all information.
- The core novelty is candidate-driven inquiry.

### 4. Delivery Format

Agreed:

Current delivery should be a website.

Implementation implication:

- Build for a live judge-facing demo.
- Prioritize clarity and storyboard over complete production workflow.
- The website can use mocked data where needed.

### 5. Full Product Workflow

Agreed:

The fuller product is not only a fixed scenario. It should show a company/hiring manager workflow:

1. Company provides role/work context.
2. Agent generates an assessment scenario.
3. Manager reviews and edits the scenario.
4. Manager shares candidate link.
5. Candidate completes inquiry assessment.
6. System produces evidence-backed evaluation report.

Implementation implication:

- MVP should include at least a mock version of company input and manager review.
- Even if scenario generation is mocked, the product story should show how company context becomes an assessment.

### 6. Scenario Structure

Agreed:

The scenario does not need to be a strict tree.

Better structure:

> Hidden context map: decision-critical facts, constraints, tensions, failure modes, stakeholder concerns, and unlock triggers.

Implementation implication:

- Represent each hidden fact as structured data.
- Candidate questions can unlock one or more hidden facts.
- Some hidden facts are high-weight; others are medium or low.

### 6.1 Scenario Ambiguity Should Feel Like Real Work

Agreed:

Scenarios should be more general than one specific hiring/product case. They should model realistic ambiguous work incidents, where the initial problem description may be incomplete, noisy, or partially misleading.

Important principle:

> The initial report is evidence, not ground truth.

Examples:

- A manager says "the API returned time jumps three times over the weekend," but this is only a partial observation.
- A UI divider line disappears, and the obvious hypothesis is layout/overlay/CSS, but the real cause is a shared config service returning a transparent color.
- A customer report points toward one failure mode, but the reporter may not understand the actual system.
- A call transcript contains useful clues, but also irrelevant details and wrong assumptions.

This is good for evaluation because strong candidates do not blindly accept the first framing. They ask for reproduction steps, affected scope, logs, recent changes, environment, config, ownership boundaries, and alternative hypotheses.

Implementation implication:

- Add noisy or incomplete initial context to scenarios.
- Include red herrings and weak signals.
- Score whether the candidate avoids anchoring too early.
- Reward hypothesis branching and evidence-seeking.
- Do not make every important fact obvious from the first prompt.
- The hidden context map should include both root-cause facts and misleading surface symptoms.

### 7. AI Environment Behavior

Agreed:

The AI environment should behave like a realistic workplace source, not a fully helpful assistant.

Rules:

- Vague questions get vague answers.
- Precise questions reveal deeper context.
- Irrelevant questions reveal little.
- Hidden facts remain hidden unless asked about.
- Wrong assumptions can be answered, but the system should not rescue the candidate.

Implementation implication:

- The prompt should explicitly restrict over-helpfulness.
- Environment response should be grounded in hidden facts.
- The model should classify the question before answering.

### 8. Candidate Constraint

Agreed:

Candidate should have limited questions.

Default:

> 5 questions before final recommendation.

Optional:

- Add time pressure, such as 10 seconds to prepare and 10 seconds to ask.

Implementation implication:

- Implement question counter.
- Time pressure is optional and should not block MVP.

### 9. Evaluation Metrics

Agreed metrics:

- Information gain
- Question precision
- Adaptive follow-up
- Hypothesis quality
- Constraint discovery
- Final decision relevance
- Efficiency

Implementation implication:

- Final report should show a scored breakdown.
- It should show unlocked and missed context.
- It should quote or summarize the candidate's strongest and weakest questions.

### 10. Scenario Generation Inputs

Agreed:

The stronger the company context, the more realistic the assessment.

Potential inputs:

- Job description
- Company profile
- Team description
- Recent bottlenecks
- Bug reports or bugfix logs
- Customer/user complaints
- Internal notes or postmortems
- Existing interview rubrics
- Candidate expectations
- Examples of strong/weak prior candidate behavior
- Public pages/docs
- Public GitHub issues or PRs
- Public web search results

Implementation implication:

- For hackathon, use fake company personas and curated mock inputs.
- Do not depend on real private data ingestion.

### 11. Manager Review Is Important

Agreed:

Scenario realism is subjective and hard to fully quantify.

Therefore:

> The manager should review, edit, and approve the generated scenario before sending it to candidates.

Implementation implication:

- Include a manager review screen.
- Show scenario, hidden facts, rubric, and risk notes.
- Allow at least lightweight edit/approve behavior, even if mocked.

### 12. Fake Company Personas For Demo

Agreed:

For hackathon, use fake company personas instead of relying on real company data.

Possible personas:

- AI hiring platform with high candidate drop-off.
- Developer tools startup with flaky enterprise CI integration.
- AI memory product with strong demo reaction but weak retention.

Implementation implication:

- Build 1 strong persona first.
- Add 2-3 personas only if time allows.

### 13. Security / Confidentiality Is Future Scope

Agreed:

In production, companies may worry about sharing sensitive internal context.

Future options:

- Redaction/de-identification
- Encryption
- Manager approval before candidate use
- Local/private deployment
- Public-only generation mode

Implementation implication:

- Mention as product vision.
- Do not build full security/redaction pipeline for hackathon.

### 14. Coworker Agent Suggestions

Agreed:

The coworker-agent's Model Judge Arena / Rubric-as-a-Service ideas are useful references, but not the main direction.

Decision:

> Do not switch to Model Judge Arena as the core product.

Reason:

- It evaluates models more than candidates.
- It risks becoming rubric generation plus model comparison.
- It loses the stronger insight: candidates reveal capability by how they ask questions under ambiguity.

What to borrow:

- Arena-style demo clarity
- Side-by-side comparisons
- Scored reports
- Human-calibrated or human-reviewed evaluation

Implementation implication:

- Build Candidate Question Arena, not Model Judge Arena.
- Optional future: use model-judge or human override to calibrate scoring.

## Current MVP Scope

Build:

- Website demo
- Fake company persona
- Company context preview
- Generated scenario preview
- Manager review/approve screen
- Candidate assessment flow
- 5-question limit
- Hidden context unlock system
- Final recommendation step
- Evaluation report

Hardcode/mock:

- Company persona
- Input documents
- Scenario generation output
- Hidden facts
- Manager review feedback
- Candidate link behavior if needed

Use AI for:

- Natural environment responses
- Question classification
- Unlocking hidden facts
- Final evaluation/report generation

Do not build:

- Auth
- Real customer data ingestion
- Real web/GitHub crawling
- Full security model
- Heavy pretraining
- Full database
- Voice/video
- Many scenarios
- Full hiring workflow

## Suggested MVP Demo Flow

1. Select fake company persona.
2. Show company inputs:
   - JD
   - company context
   - current problem
   - manager expectations
3. Click "Generate Assessment."
4. Show generated scenario:
   - candidate prompt
   - hidden facts
   - scoring rubric
   - risk notes
5. Manager approves or edits.
6. Candidate opens assessment.
7. Candidate asks up to 5 questions.
8. System reveals context based on question quality.
9. Candidate submits final recommendation.
10. System outputs evaluation report.

## Agreed Core Scenario For First Build

Scenario:

> Your company launched an AI interview product three weeks ago. Candidate drop-off is much higher than expected. The CEO asks you to diagnose the issue and recommend what the team should do next. You have 5 questions before making your recommendation.

Hidden facts:

- Senior candidates are dropping off most.
- Drop-off spikes after the third AI response.
- Latency increases after the third turn.
- Interview questions are generic and not role-specific.
- Candidates do not understand how they are being evaluated.
- Recruiters only receive summary scores without evidence.
- Some candidates use AI tools to generate polished answers.
- Strong candidates try to ask clarifying questions, but the product ignores them.

## TBD / Open Questions

### Product / Story

- Final product name: Question Arena, ContextIQ, Ambiguity Arena, InquiryRank, or something else.
- Whether the demo should start from manager/company workflow or candidate assessment directly.
- Whether to show one candidate or compare strong vs weak candidate trajectories.
- Whether the final pitch emphasizes hiring, training, or both.
- Whether to mention model evaluation as a secondary use case.

### Scope

- How much of scenario generation should be real vs mocked.
- Whether manager review edits should actually change the scenario in MVP.
- Whether candidate link should be a real shareable route or just a mode switch.
- Whether to build multiple fake personas or one highly polished persona.
- Whether to implement time pressure.
- How much noisy or misleading initial context to include without making the assessment feel unfair.

### Technical

- Which model/API to use for environment responses and scoring.
- Whether to use local/open-source models on hackathon H100s or external APIs.
- Whether hidden fact unlocking is deterministic keyword/rule-based, LLM-classified, or hybrid.
- How to persist state: localStorage, in-memory, simple JSON/database.
- Whether to implement streaming responses.
- How to prevent the environment model from revealing hidden facts too easily.

### Evaluation

- Exact scoring formula for information gain.
- Weighting of hidden facts.
- How to score question precision.
- How to detect adaptive follow-up.
- How to handle candidate attempts to jailbreak or ask for "all hidden context."
- Whether jailbreak attempts are a negative signal, a system failure, or both.
- How to score candidates who over-anchor on the first problem framing.

### Scenario Quality

- How to judge whether a generated scenario reflects real work.
- What realism checklist should the manager use.
- How much private company context is required for high-quality scenarios.
- Whether public search/open-source context should supplement company inputs.

### Data / Future Training

- Whether teammates should create synthetic data for:
  - company inputs
  - scenarios
  - hidden facts
  - weak/medium/strong questions
  - unlock mappings
  - final recommendations
  - scoring labels
- Whether any simple fine-tuning/pretraining is useful or unnecessary for hackathon.

## Implementation Priorities

Priority 1:

Make the core loop work end to end:

> scenario -> five questions -> hidden context unlocked -> final recommendation -> evaluation report.

Priority 2:

Make the product story clear:

> company context generates realistic assessments.

Priority 3:

Make the demo memorable:

> good questions unlock better context; weak questions do not.

Priority 4:

Make scoring believable:

> show evidence, not just a number.

## Best Current Pitch

Short:

> Question Arena evaluates how well candidates reduce ambiguity by asking the right questions before they answer.

Expanded:

> Hiring managers provide real work context. We generate an ambiguous scenario where candidates must ask questions to uncover hidden constraints before making a decision. The system evaluates how efficiently they extract decision-critical context and turns that into an evidence-backed hiring signal.

Most judge-facing:

> Most hiring tools score answers. We score inquiry: what candidates ask, what context they uncover, and how quickly they turn ambiguity into judgment.
