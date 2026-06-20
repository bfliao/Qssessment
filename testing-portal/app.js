const defaultAnswerPrompt = `You are a warm but busy manager in an interview-style work simulation.

Answer exactly what the candidate asked. Be kind and concise.
Do not volunteer the whole answer. Do not connect every dot for them.
If the question is vague, give a true but shallow answer.
If the question is precise, give the relevant context.
Never reveal hidden facts that the gatekeeper did not approve for this turn.`;

const templates = {
  scoping: {
    id: "forkly_order_history_export",
    title: "Forkly Order History Export",
    role: "New Grad Software Engineer",
    candidatePrompt:
      'Sam, your engineering manager, sends: "Can you add a way for users to download their order history? Swamped today, thanks." You have 5 questions before recommending what to build.',
    persona: {
      name: "Sam",
      role: "Engineering Manager",
      tone: "warm, concise, busy, not adversarial",
      answerStyle:
        "answers exactly what is asked; does not connect all dots; kind but not handholding",
    },
    maxQuestions: 5,
    ambientFacts: [
      {
        id: "team_size",
        fact: "The team has 4 engineers and one designer on this product area.",
        whenToReveal: ["team", "who is working", "resources"],
      },
      {
        id: "stack",
        fact: "The app is React Native with a Node backend and Postgres.",
        whenToReveal: ["stack", "frontend", "backend", "database", "technical"],
      },
      {
        id: "request_channel",
        fact: "The request came through the sales/customer-success channel this morning.",
        whenToReveal: ["where", "source", "who reported", "channel"],
      },
      {
        id: "existing_history",
        fact: "Users can already view past orders in the app, but there is no export.",
        whenToReveal: ["existing", "current", "today", "already", "view"],
      },
    ],
    hiddenFacts: [
      {
        id: "corporate_accounts",
        title: "Real user is corporate catering",
        fact: "The request is for corporate catering accounts, not all consumer users.",
        category: "user",
        weight: 1.4,
        knowledgeLevel: "direct",
        unlockTriggers: ["who", "asking", "user", "customer", "account", "consumer", "corporate"],
        requiresSpecificity: true,
        sampleResponse:
          "This is really for our corporate catering accounts, not every consumer user.",
        whyItMatters:
          "Changes the target user and prevents overbuilding a consumer self-serve feature.",
      },
      {
        id: "expense_reporting",
        title: "Use case is expense reporting",
        fact: "Corporate admins need order history for accounting and expense reporting.",
        category: "use_case",
        weight: 1.4,
        knowledgeLevel: "direct",
        unlockTriggers: ["why", "use", "purpose", "expense", "accounting", "job", "need"],
        requiresSpecificity: true,
        sampleResponse:
          "They need it for expense reporting. Think accounting workflow, not a pretty browsing view.",
        whyItMatters:
          "Defines what output matters and rules out a purely visual feature.",
      },
      {
        id: "csv_fields",
        title: "CSV with accounting fields",
        fact: "The useful output is a CSV with dates, totals, line items, and tax breakdown.",
        category: "format",
        weight: 1.0,
        knowledgeLevel: "direct",
        unlockTriggers: ["format", "csv", "pdf", "fields", "columns", "line item", "tax", "receipt"],
        requiresSpecificity: true,
        sampleResponse:
          "CSV is the useful format. They need dates, totals, line items, and tax breakdown.",
        whyItMatters:
          "Changes implementation from generic UI/download to a targeted data export.",
      },
      {
        id: "renewal_deadline",
        title: "Renewal deadline",
        fact: "The request is tied to a corporate client renewal next month; minimal and shipped beats polished.",
        category: "deadline",
        weight: 1.2,
        knowledgeLevel: "direct",
        unlockTriggers: ["deadline", "when", "timeline", "priority", "urgent", "v1", "polished", "renewal"],
        requiresSpecificity: true,
        sampleResponse:
          "It is tied to a renewal next month. A minimal version shipped soon is better than a polished broad launch.",
        whyItMatters:
          "Changes scope and sequencing; candidate should recommend a small v1.",
      },
      {
        id: "limited_scale",
        title: "Small initial scope",
        fact: "Only about 50 corporate accounts need this now, not the full 2M consumer user base.",
        category: "scope",
        weight: 1.0,
        knowledgeLevel: "hedged",
        unlockTriggers: ["how many", "scale", "all users", "everyone", "number", "accounts", "rollout"],
        requiresSpecificity: true,
        sampleResponse:
          "Roughly 50 corporate accounts need it right now. I would not assume this is for all 2 million users.",
        whyItMatters:
          "Prevents platform-level overengineering.",
      },
      {
        id: "pii_constraint",
        title: "PII masking",
        fact: "Exports must mask addresses and payment details; legal has flagged the data as sensitive.",
        category: "risk",
        weight: 1.2,
        knowledgeLevel: "hedged",
        unlockTriggers: ["privacy", "pii", "legal", "card", "payment", "address", "sensitive", "mask"],
        requiresSpecificity: true,
        sampleResponse:
          "Good catch. Legal mentioned masking addresses and payment details; you should confirm the exact rule.",
        whyItMatters:
          "Adds a critical compliance constraint to the implementation.",
      },
    ],
    trapAssumptions: [
      {
        id: "consumer_download_my_data",
        assumption:
          "The candidate assumes this is a general consumer 'download my data' feature.",
        whyTempting:
          "The ticket says 'users' and 'download order history', which sounds like a broad consumer self-serve feature.",
        howToDisprove:
          "Ask who needs it and what job they are using the export for.",
      },
    ],
    idealRecommendation:
      "Build a minimal CSV export for corporate catering accounts for expense reporting, including dates, totals, line items, and tax breakdown. Mask addresses and payment details, confirm exact fields with one account and legal, and ship before the renewal. Do not build a broad consumer self-serve export yet.",
  },
  debugging: {
    id: "forkly_empty_cart_bug",
    title: "Forkly Empty Cart Bug",
    role: "New Grad Software Engineer",
    candidatePrompt:
      'Sam, your engineering manager, says: "Some users say their cart is empty when they come back. Can you look into it?" You have 5 questions before recommending what to investigate or fix.',
    persona: {
      name: "Sam",
      role: "Engineering Manager",
      tone: "warm, concise, busy, not adversarial",
      answerStyle:
        "answers exactly what is asked; does not connect all dots; kind but not handholding",
    },
    maxQuestions: 5,
    ambientFacts: [
      {
        id: "team_size",
        fact: "Two engineers touched checkout recently, but nobody is assigned to this yet.",
        whenToReveal: ["team", "who", "owner", "assigned"],
      },
      {
        id: "cart_stack",
        fact: "Cart state has both local app state and server-side persistence for logged-in users.",
        whenToReveal: ["stack", "state", "server", "local", "storage"],
      },
      {
        id: "report_source",
        fact: "The first reports came from customer support tickets.",
        whenToReveal: ["source", "reported", "where", "support"],
      },
    ],
    hiddenFacts: [
      {
        id: "ios_only",
        title: "iOS only",
        fact: "The issue only appears in iOS reports; Android and web do not show the same pattern.",
        category: "platform",
        weight: 1.2,
        knowledgeLevel: "direct",
        unlockTriggers: ["platform", "ios", "android", "web", "device"],
        requiresSpecificity: true,
        sampleResponse:
          "The reports we have are iOS. I have not seen the same pattern on Android or web.",
        whyItMatters: "Narrows the investigation away from backend-only explanations.",
      },
      {
        id: "guest_users",
        title: "Guest users affected",
        fact: "The issue affects guest users, not logged-in users.",
        category: "segment",
        weight: 1.4,
        knowledgeLevel: "direct",
        unlockTriggers: ["logged in", "guest", "user type", "segment", "account"],
        requiresSpecificity: true,
        sampleResponse:
          "It looks concentrated among guest users. Logged-in users seem mostly fine.",
        whyItMatters:
          "Points to local/session behavior rather than persisted cart records.",
      },
      {
        id: "background_time",
        title: "After backgrounding",
        fact: "Carts vanish after the app is backgrounded for more than 30 minutes.",
        category: "repro",
        weight: 1.4,
        knowledgeLevel: "hedged",
        unlockTriggers: ["reproduce", "steps", "when", "background", "time", "30", "return"],
        requiresSpecificity: true,
        sampleResponse:
          "The rough repro is guest user adds items, backgrounds the app for 30-plus minutes, then returns.",
        whyItMatters:
          "Reveals the actual condition needed to reproduce the bug.",
      },
      {
        id: "release_trap",
        title: "Recent UI release is a trap",
        fact: "A UI-only release shipped three days ago, but it is likely coincidental and not the root cause.",
        category: "trap",
        weight: 1.0,
        knowledgeLevel: "hedged",
        unlockTriggers: ["recent change", "release", "deploy", "rollback", "what changed"],
        requiresSpecificity: true,
        sampleResponse:
          "There was a UI-only release three days ago. It is tempting to blame that, but I am not sure it touches cart persistence.",
        whyItMatters:
          "Tests anchoring resistance; rollback is tempting but likely wrong.",
      },
      {
        id: "session_expiry",
        title: "Session/cache expiry root cause",
        fact: "The likely root cause is guest cart session/cache expiry after inactivity.",
        category: "root_cause",
        weight: 1.8,
        knowledgeLevel: "hedged",
        unlockTriggers: ["session", "cache", "expiry", "persist", "storage", "inactivity"],
        requiresSpecificity: true,
        sampleResponse:
          "My hunch is guest cart persistence or session expiry after inactivity. Logged-in carts are server-backed.",
        whyItMatters:
          "Identifies the fix direction.",
      },
    ],
    trapAssumptions: [
      {
        id: "rollback_recent_release",
        assumption:
          "The candidate assumes the recent UI release caused the cart loss and recommends rollback.",
        whyTempting:
          "The timeline overlaps with the first reports.",
        howToDisprove:
          "Ask about affected platform, user segment, repro steps, and whether the changed code touches cart persistence.",
      },
    ],
    idealRecommendation:
      "Investigate iOS guest cart persistence after backgrounding for 30+ minutes. Do not immediately roll back the UI release unless evidence ties it to cart persistence. Reproduce with guest users, inspect local/session expiry, and patch persistence or restore cart state on return.",
  },
};

let scenario = structuredClone(templates.scoping);
let state = createState();

const els = {
  scenarioTemplate: document.getElementById("scenarioTemplate"),
  scenarioInput: document.getElementById("scenarioInput"),
  answerPrompt: document.getElementById("answerPrompt"),
  applyConfig: document.getElementById("applyConfig"),
  loadTemplate: document.getElementById("loadTemplate"),
  resetRun: document.getElementById("resetRun"),
  exportTranscript: document.getElementById("exportTranscript"),
  configStatus: document.getElementById("configStatus"),
  scenarioTitle: document.getElementById("scenarioTitle"),
  questionsLeft: document.getElementById("questionsLeft"),
  candidatePrompt: document.getElementById("candidatePrompt"),
  chatLog: document.getElementById("chatLog"),
  questionForm: document.getElementById("questionForm"),
  questionInput: document.getElementById("questionInput"),
  finalRecommendation: document.getElementById("finalRecommendation"),
  scoreRun: document.getElementById("scoreRun"),
  report: document.getElementById("report"),
  unlockedFacts: document.getElementById("unlockedFacts"),
  lastDecision: document.getElementById("lastDecision"),
};

function createState() {
  return {
    questionsRemaining: 5,
    unlockedFactIds: new Set(),
    conversation: [],
    lastDecision: {},
  };
}

function clone(value) {
  return JSON.parse(JSON.stringify(value));
}

function loadTemplate(name) {
  scenario = structuredClone ? structuredClone(templates[name]) : clone(templates[name]);
  state = createState();
  els.scenarioInput.value = JSON.stringify(scenario, null, 2);
  els.answerPrompt.value = defaultAnswerPrompt;
  render();
  setStatus(`Loaded template: ${scenario.title}`);
}

function setStatus(message, isError = false) {
  els.configStatus.textContent = message;
  els.configStatus.style.color = isError ? "#9b1c1c" : "var(--muted)";
}

function applyConfig() {
  try {
    const parsed = JSON.parse(els.scenarioInput.value);
    validateScenario(parsed);
    scenario = parsed;
    state = createState();
    render();
    setStatus("Scenario applied. Run reset.");
  } catch (error) {
    setStatus(error.message, true);
  }
}

function validateScenario(nextScenario) {
  const required = ["title", "candidatePrompt", "hiddenFacts"];
  for (const key of required) {
    if (!nextScenario[key]) throw new Error(`Missing required scenario field: ${key}`);
  }
  if (!Array.isArray(nextScenario.hiddenFacts)) {
    throw new Error("hiddenFacts must be an array.");
  }
}

function normalize(text) {
  return text.toLowerCase().replace(/\s+/g, " ").trim();
}

function countMatches(question, triggers = []) {
  const q = normalize(question);
  return triggers.filter((trigger) => q.includes(normalize(trigger))).length;
}

function hasSpecificIntent(question) {
  const q = normalize(question);
  return [
    "who",
    "why",
    "what",
    "which",
    "when",
    "how many",
    "use",
    "purpose",
    "constraint",
    "risk",
    "deadline",
    "scope",
    "reproduce",
    "affected",
    "segment",
  ].some((word) => q.includes(word));
}

function gatekeep(question) {
  const matchedHidden = scenario.hiddenFacts
    .map((fact) => ({
      fact,
      matches: countMatches(question, fact.unlockTriggers),
    }))
    .filter((item) => item.matches > 0);
  const matchedNewHidden = matchedHidden.filter((item) => !state.unlockedFactIds.has(item.fact.id));

  const matchedAmbient = (scenario.ambientFacts || [])
    .map((fact) => ({
      fact,
      matches: countMatches(question, fact.whenToReveal),
    }))
    .filter((item) => item.matches > 0);

  const specific = hasSpecificIntent(question);
  const isScattershot = matchedNewHidden.length >= 3 || question.split("?").length > 2;
  let classification = "irrelevant";
  let unlockedFactIds = [];
  let ambientFactIds = matchedAmbient.slice(0, 2).map((item) => item.fact.id);

  if (isScattershot) {
    classification = "scattershot";
  } else if (matchedHidden.length > 0 && specific) {
    classification = matchedHidden.length === 1 ? "targeted" : "sharp";
    unlockedFactIds = matchedNewHidden
      .slice(0, 2)
      .map((item) => item.fact.id);
  } else if (matchedHidden.length > 0 || matchedAmbient.length > 0 || question.length > 15) {
    classification = "broad";
  }

  return {
    classification,
    unlockedFactIds,
    ambientFactIds,
    rationale:
      classification === "scattershot"
        ? "Question touched too many hidden areas at once; treating as broad rather than unlocking many facts."
        : unlockedFactIds.length > 0
          ? "Question targeted decision-critical context with enough specificity."
          : "Question did not earn hidden context.",
  };
}

function personaAnswer(question, decision) {
  const approvedHidden = decision.unlockedFactIds
    .map((id) => scenario.hiddenFacts.find((fact) => fact.id === id))
    .filter(Boolean);
  const approvedAmbient = decision.ambientFactIds
    .map((id) => (scenario.ambientFacts || []).find((fact) => fact.id === id))
    .filter(Boolean);

  const parts = [];

  if (approvedHidden.length > 0) {
    approvedHidden.forEach((fact) => {
      parts.push(fact.sampleResponse || fact.fact);
    });
  }

  if (approvedAmbient.length > 0 && approvedHidden.length === 0) {
    approvedAmbient.forEach((fact) => parts.push(fact.fact));
  }

  if (decision.classification === "scattershot") {
    return "There are a few threads in there. I would narrow it down first. What specific part are you trying to decide?";
  }

  if (parts.length > 0) {
    return parts.join(" ");
  }

  if (decision.classification === "broad") {
    return "Broadly, yes, there is context here, but I would need a more specific question to give you something useful.";
  }

  return "I do not have much useful context from that angle.";
}

function askQuestion(event) {
  event.preventDefault();
  const question = els.questionInput.value.trim();
  if (!question || state.questionsRemaining <= 0) return;

  const decision = gatekeep(question);
  const answer = personaAnswer(question, decision);

  decision.unlockedFactIds.forEach((id) => state.unlockedFactIds.add(id));
  state.questionsRemaining -= 1;
  state.lastDecision = decision;
  state.conversation.push({ role: "candidate", text: question });
  state.conversation.push({ role: "manager", text: answer });

  els.questionInput.value = "";
  render();
}

function scoreRun() {
  const total = scenario.hiddenFacts.reduce((sum, fact) => sum + Number(fact.weight || 1), 0);
  const unlocked = scenario.hiddenFacts
    .filter((fact) => state.unlockedFactIds.has(fact.id))
    .reduce((sum, fact) => sum + Number(fact.weight || 1), 0);
  const pct = total === 0 ? 0 : Math.round((unlocked / total) * 100);
  const label =
    pct >= 75 ? "Strong ambiguity reducer" : pct >= 45 ? "Developing ambiguity reducer" : "Weak ambiguity reducer";
  const missed = scenario.hiddenFacts.filter((fact) => !state.unlockedFactIds.has(fact.id));
  const rec = els.finalRecommendation.value.trim();

  els.report.hidden = false;
  els.report.innerHTML = `
    <h3>Evaluation Report</h3>
    <p><span class="score-pill">${pct}%</span> ${label}</p>
    <p><strong>Primary metric:</strong> weighted information gain.</p>
    <p><strong>Unlocked:</strong> ${state.unlockedFactIds.size}/${scenario.hiddenFacts.length} decision-critical facts.</p>
    <h3>Missed Context</h3>
    <ul>${missed.map((fact) => `<li><strong>${escapeHtml(fact.title)}:</strong> ${escapeHtml(fact.whyItMatters)}</li>`).join("") || "<li>None.</li>"}</ul>
    <h3>Final Recommendation</h3>
    <p>${rec ? escapeHtml(rec) : '<span class="muted">No recommendation submitted.</span>'}</p>
  `;
}

function exportTranscript() {
  const payload = {
    scenarioId: scenario.id,
    title: scenario.title,
    prompt: scenario.candidatePrompt,
    unlockedFactIds: [...state.unlockedFactIds],
    conversation: state.conversation,
    finalRecommendation: els.finalRecommendation.value,
  };
  navigator.clipboard
    .writeText(JSON.stringify(payload, null, 2))
    .then(() => setStatus("Transcript copied to clipboard."))
    .catch(() => setStatus("Could not copy transcript.", true));
}

function render() {
  els.scenarioTitle.textContent = scenario.title;
  els.questionsLeft.textContent = state.questionsRemaining;
  els.candidatePrompt.textContent = scenario.candidatePrompt;
  els.chatLog.innerHTML = state.conversation
    .map(
      (msg) => `
      <div class="message ${msg.role}">
        <small>${msg.role === "candidate" ? "Candidate" : scenario.persona?.name || "Manager"}</small>
        ${escapeHtml(msg.text)}
      </div>
    `,
    )
    .join("");
  els.chatLog.scrollTop = els.chatLog.scrollHeight;
  els.unlockedFacts.innerHTML =
    scenario.hiddenFacts
      .filter((fact) => state.unlockedFactIds.has(fact.id))
      .map((fact) => `<li><strong>${escapeHtml(fact.title)}</strong><br><span class="muted">${escapeHtml(fact.fact)}</span></li>`)
      .join("") || '<li class="muted">No hidden facts unlocked yet.</li>';
  els.lastDecision.textContent = JSON.stringify(state.lastDecision, null, 2);
  els.questionInput.disabled = state.questionsRemaining <= 0;
  els.questionForm.querySelector("button").disabled = state.questionsRemaining <= 0;
}

function escapeHtml(value) {
  return String(value)
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#039;");
}

els.applyConfig.addEventListener("click", applyConfig);
els.loadTemplate.addEventListener("click", () => loadTemplate(els.scenarioTemplate.value));
els.resetRun.addEventListener("click", () => {
  state = createState();
  els.finalRecommendation.value = "";
  els.report.hidden = true;
  render();
  setStatus("Run reset.");
});
els.exportTranscript.addEventListener("click", exportTranscript);
els.questionForm.addEventListener("submit", askQuestion);
els.scoreRun.addEventListener("click", scoreRun);
els.scenarioTemplate.addEventListener("change", () => loadTemplate(els.scenarioTemplate.value));

loadTemplate("scoping");
