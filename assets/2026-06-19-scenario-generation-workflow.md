# Scenario Generation Workflow for Question Arena

Date: 2026-06-19

## Product Expansion

Question Arena should not only be a fixed assessment scenario.

The fuller product loop is:

> Company context -> generated work scenario -> manager review/edit -> candidate assessment link -> inquiry-based evaluation report.

The core candidate-side signal remains:

> Can this person reduce ambiguity under realistic work conditions?

## Why Scenario Generation Matters

The quality of the assessment depends on whether the scenario feels close to the company's real work.

Generic scenarios can evaluate generic reasoning, but top-tier hiring needs scenarios that reflect:

- the actual role
- the team's current bottlenecks
- the company's working style
- real failure modes
- real constraints
- what the hiring manager considers excellent judgment

The more relevant the input context, the stronger the assessment signal.

## Main Workflow

### 1. Hiring Manager Provides Context

The hiring manager gives the system raw context about the role and company.

Possible inputs:

- Job description
- Company description
- Team description
- Recent product/project bottlenecks
- Ambiguous incident reports
- Customer or manager call transcripts
- Bug reports or bugfix logs
- Customer/user complaints
- Internal postmortems
- Existing interview rubrics
- Candidate expectations
- Examples of good and bad prior candidate behavior
- Public company pages or docs
- Public GitHub issues, PRs, or open-source references
- Web search results about similar work/problems

For the hackathon demo, use fake company personas and curated mock inputs.

### 2. Agent Generates Scenario

The agent turns company context into a realistic ambiguous work scenario.

The scenario should include:

- Candidate-facing prompt
- Role/context framing
- Hidden decision-critical facts
- Surface symptoms or noisy initial observations
- Red herrings or misleading-but-plausible clues
- Expected strong question directions
- Weak/generic question examples
- Ideal final recommendation
- Scoring rubric
- Risk notes for manager review

Important:

The scenario does not need to be a strict tree.

It can be a hidden context map:

- facts
- constraints
- tensions
- failure modes
- stakeholder concerns
- red herrings
- unlock triggers

Candidate questions reveal parts of this map.

The initial scenario prompt should not always be a clean business case. It can be a messy work artifact:

- a manager's vague Slack message
- a bug report
- a customer complaint
- a short call transcript
- a product metric anomaly
- a partial log summary

The key design principle:

> The first description is evidence, not ground truth.

Strong candidates should realize that the initial framing may be incomplete or wrong, then ask questions to test assumptions and gather better evidence.

### 3. Manager Reviews and Edits

Before sending to candidates, the hiring manager should see the generated scenario and adjust it.

The review screen should let the manager answer:

- Does this scenario reflect real work here?
- Is the scenario too generic?
- Is any hidden fact inaccurate?
- Is any hidden fact too sensitive?
- Are the expected strong questions actually good signals?
- Does the rubric match what this team values?
- Are there risks, bias, or unrealistic assumptions?

Manager review is important because scenario realism is partly subjective and hard to fully quantify.

### 4. Candidate Receives Assessment Link

After approval, the manager shares a link with the candidate.

The candidate sees:

- Scenario prompt
- Question limit
- Time limit, optional
- Instructions: ask questions before answering

The candidate does not see:

- Hidden facts
- Unlock triggers
- Rubric details
- Ideal answer

### 5. Candidate Performs Inquiry Assessment

The candidate asks a limited number of questions.

The AI environment answers according to hidden context rules:

- Vague questions get vague answers.
- Precise questions reveal deeper context.
- Irrelevant questions reveal little.
- Unasked hidden facts stay hidden.
- Wrong assumptions can be corrected, but the system should not rescue the candidate.

Optional time pressure:

- 10 seconds to prepare
- 10 seconds to ask
- 5 total questions

This can make the assessment harder to game and closer to live judgment.

### 6. System Produces Evaluation Report

The final report should show:

- What hidden context the candidate uncovered
- What they missed
- Which questions were high-value
- Which questions were vague or wasted
- Whether they adapted based on prior answers
- Whether the final recommendation used the earned context
- Overall ambiguity-reduction signal

## Fake Company Persona Strategy for Hackathon

For the hackathon, do not depend on a real company giving private data.

Instead, create 2-3 fake company personas with realistic inputs.

Example fake companies:

1. AI hiring platform
   - Problem: candidate drop-off after AI interview launch
   - Role: product/engineering hire

2. Developer tools startup
   - Problem: enterprise users report flaky CI integration
   - Role: full-stack / infra engineer

3. AI memory product
   - Problem: users love the demo but retention is low
   - Role: product engineer / growth builder

Each persona should include:

- JD
- team context
- current bottleneck
- sample internal notes
- hidden constraints
- manager expectations

The website can show that these inputs generated the assessment scenario.

## Confidentiality and Security Considerations

In production, companies may worry about uploading sensitive internal data.

Possible future answers:

- Redact private information before scenario generation.
- De-identify people, customers, and proprietary names.
- Let managers approve every scenario before candidate use.
- Support local or private deployment.
- Encrypt stored company context.
- Allow public-only scenario generation from JD and web data.

For the hackathon, this should be framed as future product design, not core implementation.

## Quality Problem

A key challenge:

> How do we know a generated scenario is actually close to the team's real work?

This is hard to fully quantify.

Practical answer:

- Use richer input context.
- Ask the manager to review and edit.
- Show a realism checklist.
- Let the manager mark hidden facts as accurate, sensitive, or irrelevant.
- Let the system regenerate based on feedback.

This is a human-in-the-loop product, not fully autonomous scenario generation.

## MVP Scope for 24 Hours

Build the illusion of the full workflow, but only implement the core parts.

### Build

- Fake company persona selector
- Generated scenario preview
- Manager review/edit screen
- Candidate assessment link or candidate mode
- 5-question inquiry flow
- Evaluation report

### Hardcode or Mock

- Company personas
- Input documents
- Scenario generation output
- Hidden facts
- Manager review feedback

### Use AI For

- Natural environment responses
- Question classification
- Final report generation

### Do Not Build

- Real web crawling
- GitHub crawling
- Private data ingestion
- Security model
- Full redaction pipeline
- Complex scenario accuracy benchmark
- Heavy model training

## Demo Story

1. Select fake company persona.

   > "AcmeHire is an AI interview startup. They want to hire a senior product engineer."

2. Show company inputs.

   - JD
   - current problem
   - manager expectations
   - internal notes

3. Click "Generate Assessment."

4. Show generated scenario and hidden context map.

5. Manager edits or approves.

6. Candidate opens assessment link.

7. Candidate asks five questions.

8. System shows which hidden facts were unlocked.

9. Candidate gives final answer.

10. System produces evaluation report.

## Key Positioning

Short:

> We turn company context into ambiguity-based candidate assessments.

More specific:

> Hiring managers provide real work context. We generate a scenario where candidates must ask questions to uncover hidden constraints before making a decision. The system evaluates how well they reduce ambiguity.

Best sentence:

> Question Arena turns the manager's implicit judgment of "this person knows what to ask" into a structured, evidence-backed hiring signal.
