// JD-driven live incident crawler ("MCP tool", integrated as a function).
//
// Sources (high-signal technical, no scraping of random web pages):
//   - GitHub Issues search API   -> real open-source bugs
//   - Stack Exchange API (SO)     -> real debugging Q&A
//   - local crawled corpus        -> graceful fallback when both are unreachable
//
// Pipeline:
//   1. LLM turns the JD into technical search queries + keywords.
//   2. Query GitHub + Stack Overflow live for each query.
//   3. Normalize results into Incident.
//   4. Fall back to the local corpus if nothing usable came back.

import { chatJSON } from "./openai";
import { loadIncidents } from "./incidents";
import type { Incident } from "./types";

const DEFAULT_MAX_RESULTS = 8;
const FETCH_TIMEOUT_MS = 9000;
const PER_SOURCE = 5;
const UA = "intervieweragent-crawler";

async function fetchWithTimeout(url: string, init?: RequestInit) {
  const controller = new AbortController();
  const t = setTimeout(() => controller.abort(), FETCH_TIMEOUT_MS);
  try {
    return await fetch(url, {
      ...init,
      signal: controller.signal,
      headers: { "User-Agent": UA, ...(init?.headers || {}) },
    });
  } finally {
    clearTimeout(t);
  }
}

function decodeEntities(s: string): string {
  return s
    .replace(/&amp;/g, "&")
    .replace(/&lt;/g, "<")
    .replace(/&gt;/g, ">")
    .replace(/&quot;/g, '"')
    .replace(/&#39;/g, "'")
    .replace(/&#x?[0-9a-f]+;/gi, " ");
}

function stripTags(html: string): string {
  return decodeEntities(
    html
      .replace(/<script[\s\S]*?<\/script>/gi, " ")
      .replace(/<style[\s\S]*?<\/style>/gi, " ")
      .replace(/<[^>]+>/g, " ")
  )
    .replace(/\s+/g, " ")
    .trim();
}

// ---- Step 1: derive search plan from the JD ----

interface QueryPlan {
  domain: string;
  keywords: string[];
  queries: string[];
}

const QUERY_SYSTEM = `You turn a job description into search queries that will find
REAL, scoped technical bugs/incidents on GitHub Issues and Stack Overflow.

Each query should read like something an engineer would search when debugging:
concrete symptoms, error messages, or component + failure mode.
Examples: "redis connection pool timeout", "postgres deadlock under load",
"kafka consumer lag spike", "nginx 502 upstream timeout".

Return STRICT JSON:
{
  "domain": string,       // e.g. "backend / SRE", "data engineering"
  "keywords": string[],   // 4-8 technical keywords from the JD
  "queries": string[]     // 3-5 concrete debugging search queries
}`;

async function derivePlan(jd: string): Promise<QueryPlan> {
  const plan = await chatJSON<QueryPlan>(
    QUERY_SYSTEM,
    `JOB DESCRIPTION:\n${jd.trim()}\n\nProduce the search plan now.`,
    0.3
  );
  return {
    domain: plan.domain || "",
    keywords: Array.isArray(plan.keywords) ? plan.keywords.slice(0, 8) : [],
    queries: Array.isArray(plan.queries) ? plan.queries.slice(0, 5) : [],
  };
}

// ---- Step 2a: GitHub Issues search ----

interface GitHubIssue {
  id: number;
  title: string;
  html_url: string;
  body: string | null;
  labels: Array<{ name: string } | string>;
  reactions?: { total_count?: number };
  pull_request?: unknown;
}

function repoFromIssueUrl(url: string): string {
  const m = url.match(/github\.com\/([^/]+\/[^/]+)\/issues/);
  return m ? m[1] : "github";
}

async function searchGitHub(query: string): Promise<Incident[]> {
  const q = encodeURIComponent(`${query} in:title,body is:issue`);
  const url = `https://api.github.com/search/issues?q=${q}&sort=reactions&order=desc&per_page=${PER_SOURCE}`;
  const headers: Record<string, string> = {
    Accept: "application/vnd.github+json",
  };
  if (process.env.GITHUB_TOKEN) {
    headers.Authorization = `Bearer ${process.env.GITHUB_TOKEN}`;
  }

  const res = await fetchWithTimeout(url, { headers });
  if (!res.ok) return [];
  const data = (await res.json()) as { items?: GitHubIssue[] };
  const items = (data.items || []).filter((it) => !it.pull_request);

  return items
    .filter((it) => (it.body || "").length > 120)
    .map((it) => {
      const labels = (it.labels || []).map((l) =>
        typeof l === "string" ? l : l.name
      );
      const body = stripTags(it.body || "");
      return {
        id: `gh_${it.id}`,
        title: decodeEntities(it.title).slice(0, 200),
        source: it.html_url,
        company: repoFromIssueUrl(it.html_url),
        product: "GitHub issue",
        categories: ["github-issue"],
        keywords: labels.slice(0, 8),
        summary: body.slice(0, 400),
        description: body.slice(0, 2000),
      } satisfies Incident;
    });
}

// ---- Step 2b: Stack Overflow search ----

interface SOQuestion {
  question_id: number;
  title: string;
  link: string;
  body?: string;
  tags?: string[];
  is_answered?: boolean;
  score?: number;
}

async function searchStackOverflow(query: string): Promise<Incident[]> {
  const params = new URLSearchParams({
    order: "desc",
    sort: "relevance",
    q: query,
    site: "stackoverflow",
    filter: "withbody",
    pagesize: String(PER_SOURCE),
    answers: "1",
  });
  if (process.env.STACKEXCHANGE_KEY) {
    params.set("key", process.env.STACKEXCHANGE_KEY);
  }
  const url = `https://api.stackexchange.com/2.3/search/advanced?${params}`;

  const res = await fetchWithTimeout(url);
  if (!res.ok) return [];
  const data = (await res.json()) as { items?: SOQuestion[] };
  const items = data.items || [];

  return items
    .filter((q) => q.is_answered && (q.body || "").length > 120)
    .map((q) => {
      const body = stripTags(q.body || "");
      return {
        id: `so_${q.question_id}`,
        title: decodeEntities(q.title).slice(0, 200),
        source: q.link,
        company: "stackoverflow.com",
        product: "Stack Overflow",
        categories: ["stackoverflow"],
        keywords: (q.tags || []).slice(0, 8),
        summary: body.slice(0, 400),
        description: body.slice(0, 2000),
      } satisfies Incident;
    });
}

// ---- Fallback: JD-filtered local corpus ----

async function fallbackFromCorpus(
  keywords: string[],
  max: number
): Promise<Incident[]> {
  const all = await loadIncidents();
  const kw = keywords.map((k) => k.toLowerCase());
  const scored = all
    .map((inc) => {
      const hay =
        `${inc.title} ${inc.summary} ${inc.keywords.join(" ")}`.toLowerCase();
      const score = kw.reduce((s, k) => (k && hay.includes(k) ? s + 1 : s), 0);
      return { inc, score };
    })
    .sort((a, b) => b.score - a.score);
  const top = scored
    .filter((s) => s.score > 0)
    .slice(0, max)
    .map((s) => s.inc);
  return top.length > 0 ? top : all.slice(0, max);
}

// ---- The tool ----

export interface CrawlResult {
  plan: QueryPlan;
  incidents: Incident[];
  usedFallback: boolean;
}

/**
 * JD-driven live incident crawl tool.
 * Pulls real bugs/incidents from GitHub Issues + Stack Overflow, ranked for the JD.
 */
export async function crawlIncidentsForJD(
  jd: string,
  opts: { maxResults?: number } = {}
): Promise<CrawlResult> {
  const max = opts.maxResults ?? DEFAULT_MAX_RESULTS;
  const plan = await derivePlan(jd);

  const perQuery = await Promise.all(
    plan.queries.flatMap((q) => [
      searchGitHub(q).catch(() => [] as Incident[]),
      searchStackOverflow(q).catch(() => [] as Incident[]),
    ])
  );

  // Dedupe by source URL, interleave sources for variety.
  const seen = new Set<string>();
  const incidents: Incident[] = [];
  for (const inc of perQuery.flat()) {
    if (inc.source && !seen.has(inc.source)) {
      seen.add(inc.source);
      incidents.push(inc);
    }
  }

  if (incidents.length > 0) {
    return { plan, incidents: incidents.slice(0, max), usedFallback: false };
  }

  const fallback = await fallbackFromCorpus(plan.keywords, max);
  return { plan, incidents: fallback, usedFallback: true };
}
