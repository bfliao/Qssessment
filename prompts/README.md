# Prompt Development

This folder is for prompt work so teammates can iterate without touching the UI.

Current files:

- `interview-answerer.md`: manager/persona response prompt
- `gatekeeper.md`: hidden-fact unlock/classification prompt

Development rule:

Keep scoring and answer generation conceptually separate.

- Gatekeeper decides what the candidate earned.
- Manager persona speaks only from approved facts.

The current app uses deterministic mock logic, but these prompts define the intended model-backed behavior.
