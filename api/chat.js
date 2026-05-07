const MCP_URL = "http://localhost:6280/mcp";
const MCP_LIBRARY = "envio-docs-no-llm-completes";

const GEMINI_URL = "https://generativelanguage.googleapis.com/v1beta/openai/chat/completions";
const GROQ_URL = "https://api.groq.com/openai/v1/chat/completions";
const OPENROUTER_URL = "https://openrouter.ai/api/v1/chat/completions";
const MISTRAL_URL = "https://api.mistral.ai/v1/chat/completions";
const DEEPSEEK_URL = "https://api.deepseek.com/v1/chat/completions";
const GROQ_FAST_MODEL = "llama-3.1-8b-instant";

// Built per-request so env changes take effect without restart.
// Free providers tried first; DeepSeek paid sits at the very end as last-resort.
// Each line uses an independent quota or load pool — a 429/503 on one rarely
// affects the next.
function getMainProviders() {
  return [
    // === FREE ===
    // Gemini chain — Google AI Studio. All share the same key but each model
    // has independent per-model RPM/TPM/RPD buckets.
    { name: "gemini-2.5-flash",      url: GEMINI_URL,     model: "gemini-2.5-flash",            keyEnv: "GOOGLE_API_KEY" },
    { name: "gemini-2.0-flash",      url: GEMINI_URL,     model: "gemini-2.0-flash",            keyEnv: "GOOGLE_API_KEY" },
    { name: "gemini-2.0-flash-lite", url: GEMINI_URL,     model: "gemini-2.0-flash-lite",       keyEnv: "GOOGLE_API_KEY" },
    // OpenRouter GPT-OSS — separate provider, separate quota.
    { name: "openrouter-gpt-oss",    url: OPENROUTER_URL, model: "openai/gpt-oss-120b:free",    keyEnv: "OPENROUTER_API_KEY" },
    // Mistral — separate provider, generous free experimental tier.
    { name: "mistral-small",         url: MISTRAL_URL,    model: "mistral-small-latest",        keyEnv: "MISTRAL_API_KEY" },
    // Gemma 26B MoE — same Google key, separate bucket. May emit reasoning tags;
    // the server-side stripper handles them.
    { name: "gemma-4-26b",           url: GEMINI_URL,     model: "gemma-4-26b-a4b-it",          keyEnv: "GOOGLE_API_KEY" },
    // Groq — separate provider, ~100K TPD on free tier for Llama 3.3 70B.
    { name: "groq",                  url: GROQ_URL,       model: "llama-3.3-70b-versatile",     keyEnv: "GROQ_API_KEY" },
    // === PAID (final fallback) ===
    // DeepSeek API direct — only hit when every free provider above has failed.
    { name: "deepseek-paid",         url: DEEPSEEK_URL,   model: "deepseek-chat",               keyEnv: "DEEPSEEK_API_KEY" },
  ];
}

const SEARCH_LIMIT_PER_QUERY = 4;
const MAX_REWRITTEN_QUERIES = 3;
const MAX_DOCS_CONTEXT_CHAR = 14000;     // overall safety cap on the fused context
const PER_CHUNK_CHAR_BUDGET = 1800;      // per-URL chunk cap so one page can't dominate
const MAX_FUSED_CHUNKS = 8;              // how many unique URLs to include after fusion

const MAX_HISTORY_MESSAGES = 4;          // 2 user/assistant pairs
const MAX_HISTORY_CHAR = 8000;           // per-message hard safety cap (server-side anti-abuse)
const LAST_AI_CHAR_CAP = 2000;           // most-recent AI response: kept ~full for "tell me more" fidelity
const OLDER_AI_SUMMARY_TOKENS = 120;     // max output tokens for summarizing each older AI response

// Pricing pages live on envio.dev (not in the docs MCP). Fetched on demand for
// pricing-related questions and cached in-memory for 1h.
const PRICING_URLS = {
  hosting:   "https://envio.dev/pricing/hosting",
  hypersync: "https://envio.dev/pricing/hypersync",
  hyperrpc:  "https://envio.dev/pricing/hyperrpc",
};
const PRICING_TTL_MS = 60 * 60 * 1000;
const PER_PRICING_PAGE_CHAR = 3500;

const CORS_HEADERS = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "POST, OPTIONS",
  "Access-Control-Allow-Headers": "Content-Type",
};

function setCors(res) {
  for (const [k, v] of Object.entries(CORS_HEADERS)) res.setHeader(k, v);
}

async function mcpRequest(method, params, id) {
  const res = await fetch(MCP_URL, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Accept: "application/json, text/event-stream",
    },
    body: JSON.stringify({ jsonrpc: "2.0", id, method, params }),
  });
  const contentType = res.headers.get("content-type") || "";
  const text = await res.text();
  if (contentType.startsWith("text/event-stream")) {
    for (const line of text.split(/\r?\n/)) {
      if (line.startsWith("data: ")) {
        const payload = line.slice(6).trim();
        if (payload && payload !== "[DONE]") return JSON.parse(payload);
      }
    }
    throw new Error("Empty SSE response from MCP");
  }
  return JSON.parse(text);
}

function extractToolText(response) {
  const toolResult = response?.result;
  if (!toolResult || toolResult.isError) return "";
  return (toolResult.content || [])
    .filter((c) => c && c.type === "text" && typeof c.text === "string")
    .map((c) => c.text)
    .join("\n");
}

function extractUrlsFromSearch(searchText) {
  const urls = [];
  const seen = new Set();
  // arabold/docs-mcp-server uses "Result N: <url>"; older format used "URL: <url>".
  const re = /(?:Result\s*\d+:|URL:)\s*(https?:\/\/\S+)/g;
  let m;
  while ((m = re.exec(searchText)) !== null) {
    const u = m[1].replace(/[).,]+$/, "");
    if (!seen.has(u)) {
      seen.add(u);
      urls.push(u);
    }
  }
  return urls;
}

// Parse arabold's "Result N: <url>\n\n<content>" format into individual {url, content} entries.
// Sections are separated by horizontal-rule lines (40+ dashes). Position is preserved.
function parseSearchResults(text) {
  if (!text) return [];
  const sections = text
    .split(/\n-{20,}\n/)
    .map((s) => s.trim())
    .filter(Boolean);
  const results = [];
  for (const section of sections) {
    const m = section.match(/^Result\s*\d+:\s*(https?:\/\/\S+)\s*\n+([\s\S]*)$/);
    if (m) {
      const url = m[1].replace(/[).,]+$/, "");
      const content = m[2].trim();
      if (url && content) results.push({ url, content });
    }
  }
  return results;
}

// Fuse search results across queries using Reciprocal Rank Fusion (RRF) plus
// URL-slug keyword bonus and section-affinity bonus. RRF rewards high-ranked
// hits; slug bonus rewards URL paths containing question words; section bonus
// rewards URLs in the docs section the question is asking about.
const RRF_K = 60;
const SLUG_KEYWORD_BONUS = 0.06;
const SECTION_AFFINITY_BONUS = 0.25;

// Detect which docs section(s) the question is asking about. Returns an array
// of regex patterns; URLs whose pathname matches any pattern get a strong
// ranking bonus. Multiple intents stack.
function detectSectionAffinities(question) {
  const q = question.toLowerCase();
  const patterns = [];

  // HyperSync — direct data layer
  if (/\bhyper\s?sync\b/.test(q)) {
    patterns.push(/\/docs\/HyperSync\//i);
  }
  // HyperRPC
  if (/\bhyper\s?rpc\b/.test(q)) {
    patterns.push(/\/docs\/HyperRPC\//i);
  }
  // Envio Cloud / hosted service / deployment / org setup
  if (/\b(envio cloud|hosted service|hosted-service|deploy(ment|ing)?|github app|envio app|organisation|organization|cloud cli)\b/.test(q)) {
    patterns.push(/\/docs\/HyperIndex\/(hosted-service|envio-cloud|organisation|organization)/i);
  }
  // Troubleshooting / errors / issues
  if (/\b(error|errors|issue|issues|problem|broken|fails?|failing|not working|won['']t work|troubleshoot|debug|fix)\b/.test(q)) {
    patterns.push(/(common-issues|troubleshoot|debug|faq)/i);
  }
  // Tutorials / examples / "how do I get started"
  if (/\b(tutorial|example|walkthrough|getting started|quickstart|how to start|first indexer)\b/.test(q)) {
    patterns.push(/(tutorial|example|getting-started|quickstart)/i);
  }
  // Chain / network support questions — boost both the native supported-networks
  // lists AND the RPC fallback page (so the model can mention both options).
  if (/\b(support(ed|s)?|compatible|works with|chain|chains|network|networks)\b/.test(q)) {
    patterns.push(/(supported-networks|hypersync-supported|hyperrpc-supported)/i);
    patterns.push(/(rpc|evm[-_]chain|any[-_]evm)/i);
  }
  // HyperIndex — handlers, configs, indexer concepts. Boosted independently
  // of HyperSync/HyperRPC since questions like "index events using hypersync"
  // legitimately need pages from both sections.
  if (/\b(indexer|index|handler|event|config\.yaml|loader|effect api|reorg|wildcard|preload)\b/.test(q)) {
    patterns.push(/\/docs\/HyperIndex\//i);
  }
  return patterns;
}

function fuseSearchResults(searchResults, originalQuestion) {
  const urlMap = new Map();
  searchResults.forEach((sr, qIdx) => {
    const parsed = parseSearchResults(sr.text);
    parsed.forEach((r, posIdx) => {
      if (!urlMap.has(r.url)) {
        urlMap.set(r.url, {
          url: r.url,
          contents: [],
          queriesHit: new Set(),
          bestPosition: posIdx,
          rrf: 0,
        });
      }
      const info = urlMap.get(r.url);
      info.contents.push(r.content);
      info.queriesHit.add(qIdx);
      info.rrf += 1 / (RRF_K + posIdx);
      if (posIdx < info.bestPosition) info.bestPosition = posIdx;
    });
  });

  // Tokenize the question for slug-keyword matching (3+ char words only).
  const questionTokens = (originalQuestion || "")
    .toLowerCase()
    .split(/\W+/)
    .filter((w) => w.length >= 3);

  // Detect section affinity from the question (e.g. asks about HyperSync → boost /docs/HyperSync/).
  const sectionPatterns = detectSectionAffinities(originalQuestion || "");

  return [...urlMap.values()]
    .map((info) => {
      let slug = "";
      try { slug = new URL(info.url).pathname.toLowerCase(); } catch {}

      let keywordHits = 0;
      for (const token of questionTokens) {
        const probe = token.slice(0, Math.min(token.length, 6));
        if (slug.includes(probe)) keywordHits += 1;
      }

      let sectionHits = 0;
      for (const pat of sectionPatterns) {
        if (pat.test(info.url)) sectionHits += 1;
      }

      return {
        url: info.url,
        content: info.contents.reduce((a, b) => (a.length > b.length ? a : b), ""),
        queriesHit: info.queriesHit.size,
        bestPosition: info.bestPosition,
        score:
          info.rrf +
          keywordHits * SLUG_KEYWORD_BONUS +
          sectionHits * SECTION_AFFINITY_BONUS,
      };
    })
    .sort((a, b) => b.score - a.score);
}

function detectPricingIntent(question) {
  const q = question.toLowerCase();
  return /\b(price|pricing|cost|costs|how much|free tier|tier|plan|plans|subscription|subscribe|billing|paid|expensive|cheap)\b|\$/.test(q);
}

function detectPricingProducts(question) {
  const q = question.toLowerCase();
  const products = [];
  if (/\bhypersync\b|\bhyper sync\b/.test(q)) products.push("hypersync");
  if (/\bhyperrpc\b|\bhyper rpc\b|(?<!hyper)\brpc\b/.test(q)) products.push("hyperrpc");
  if (/\bhosting\b|\bhosted\b|\bcloud\b|\bdeploy\b|\bindex(er|ing)?\b/.test(q)) products.push("hosting");
  return products.length > 0 ? products : Object.keys(PRICING_URLS);
}

function stripHtml(html) {
  let text = html.replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, " ");
  text = text.replace(/<style\b[^<]*(?:(?!<\/style>)<[^<]*)*<\/style>/gi, " ");
  text = text.replace(/<noscript\b[^<]*(?:(?!<\/noscript>)<[^<]*)*<\/noscript>/gi, " ");
  text = text.replace(/<[^>]+>/g, " ");
  text = text
    .replace(/&nbsp;/g, " ")
    .replace(/&amp;/g, "&")
    .replace(/&lt;/g, "<")
    .replace(/&gt;/g, ">")
    .replace(/&quot;/g, '"')
    .replace(/&#39;/g, "'");
  return text.replace(/\s+/g, " ").trim();
}

const pricingCache = new Map();

async function fetchPricingPage(url) {
  const now = Date.now();
  const cached = pricingCache.get(url);
  if (cached && cached.expiresAt > now) return cached.text;
  try {
    const res = await fetch(url, { headers: { "User-Agent": "envio-docs-chat" } });
    if (!res.ok) return "";
    const html = await res.text();
    const text = stripHtml(html).slice(0, PER_PRICING_PAGE_CHAR);
    pricingCache.set(url, { text, expiresAt: now + PRICING_TTL_MS });
    return text;
  } catch {
    return "";
  }
}

function sanitizeHistory(rawHistory) {
  if (!Array.isArray(rawHistory)) return [];
  return rawHistory
    .filter(
      (m) =>
        m &&
        (m.role === "user" || m.role === "assistant") &&
        typeof m.content === "string" &&
        m.content.trim().length > 0
    )
    .slice(-MAX_HISTORY_MESSAGES)
    .map((m) => ({
      role: m.role,
      content:
        m.content.length > MAX_HISTORY_CHAR
          ? m.content.slice(0, MAX_HISTORY_CHAR) + "…"
          : m.content,
    }));
}

const SUMMARIZE_SYSTEM_PROMPT =
  "You compress an assistant response into a 1-2 sentence summary for use as conversation context.\n\n" +
  "PRESERVE: the topic, key technical terms (page names like `effect-api`, `hosted-service-deployment`; commands like `envio init`; file names like `config.yaml`; API names; UI labels), and the main conclusion or recommendation.\n" +
  "OMIT: code blocks, step-by-step details, full URLs (just mention the page slug).\n" +
  "Output ONLY the summary — no preamble, no quoting, no 'Summary:' prefix. Maximum 2 sentences.";

async function summarizeAiMessage(content, groqKey) {
  try {
    const res = await fetch(GROQ_URL, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${groqKey}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: GROQ_FAST_MODEL,
        stream: false,
        temperature: 0.2,
        max_tokens: OLDER_AI_SUMMARY_TOKENS,
        messages: [
          { role: "system", content: SUMMARIZE_SYSTEM_PROMPT },
          { role: "user", content },
        ],
      }),
    });
    if (!res.ok) return null;
    const data = await res.json();
    const summary = data?.choices?.[0]?.message?.content?.trim();
    return summary || null;
  } catch {
    return null;
  }
}

// Compress history for use in the main model call:
// - Older AI responses → summarized via fast model (preserves end-of-response info)
// - Most recent AI response → kept full (capped) for high-fidelity "tell me more" follow-ups
// - User messages → unchanged (always short)
async function compressHistory(history, groqKey) {
  if (history.length === 0) return [];

  // Find index of the most-recent AI message — that one stays full.
  let lastAiIdx = -1;
  for (let i = history.length - 1; i >= 0; i--) {
    if (history[i].role === "assistant") {
      lastAiIdx = i;
      break;
    }
  }

  const toSummarizeCount = history.filter(
    (m, i) => m.role === "assistant" && i !== lastAiIdx && m.content.length > 300
  ).length;
  console.log(`[chat] history: ${history.length} msgs, compressing ${toSummarizeCount} older AI`);

  // Older AI messages run through the summarizer in parallel.
  const tasks = history.map((m, i) => {
    if (m.role === "assistant" && i !== lastAiIdx && m.content.length > 300) {
      return summarizeAiMessage(m.content, groqKey).then((s) => ({ idx: i, summary: s, origLen: m.content.length }));
    }
    return Promise.resolve(null);
  });
  const results = await Promise.all(tasks);

  return history.map((m, i) => {
    const r = results[i];
    if (r && r.summary) {
      console.log(`  msg[${i}] (assistant): ${r.origLen} → ${r.summary.length} chars (summary)`);
      return { role: m.role, content: `[summary of earlier reply] ${r.summary}` };
    }
    if (m.role === "assistant" && i === lastAiIdx && m.content.length > LAST_AI_CHAR_CAP) {
      console.log(`  msg[${i}] (assistant, latest): ${m.content.length} → ${LAST_AI_CHAR_CAP} chars (capped)`);
      return { role: m.role, content: m.content.slice(0, LAST_AI_CHAR_CAP) + "…" };
    }
    return m;
  });
}

async function retrievePricingContext(question) {
  const products = detectPricingProducts(question);
  console.log(`[chat] pricing products: ${products.join(", ")}`);
  const fetched = await Promise.all(
    products.map(async (p) => ({
      product: p,
      url: PRICING_URLS[p],
      text: await fetchPricingPage(PRICING_URLS[p]),
    }))
  );
  const ok = fetched.filter((f) => f.text);
  console.log(`[chat] pricing fetched: ${ok.length}/${fetched.length} pages`);
  if (ok.length === 0) return "";
  return ok
    .map((f) => `### ${f.product} pricing — source: ${f.url}\n${f.text}`)
    .join("\n\n---\n\n");
}

const QUERY_REWRITE_SYSTEM_PROMPT =
  "You generate documentation search queries for the Envio docs (HyperIndex, HyperSync, HyperRPC, Envio Cloud / hosted service).\n\n" +
  "If conversation history is provided, USE IT to resolve pronouns and follow-up references in the latest question — e.g. 'tell me more about that', 'how about for blog posts?', 'what about errors?'. Treat the latest question as a continuation of the conversation.\n\n" +
  "## CONTEXT — pages you should target\n" +
  "Common doc pages and what they cover:\n" +
  "- hosted-service-deployment → step-by-step UI walkthrough (login → org → GitHub app → repo → indexer → config)\n" +
  "- hosted-service / hosted-service-features → Envio Cloud overview, GitHub-integrated workflow\n" +
  "- envio-cloud-cli → CLI commands for cloud deployment\n" +
  "- effect-api → external calls, eth_call, Viem transport, persistence\n" +
  "- event-handlers → handler patterns, external calls in handlers\n" +
  "- preload-optimization → loaders, batch reads\n" +
  "- configuration-file → config.yaml options\n" +
  "- reorgs-support → reorg handling, ReorgDetected, rollback_on_reorg\n" +
  "- testing → test setup, mocha\n" +
  "- getting-started → setup guide, envio init\n" +
  "- contract-state → reading on-chain state\n" +
  "- ipfs → IPFS integration\n" +
  "- multichain-indexing → multichain config\n" +
  "- HyperSync/hypersync-supported-networks → list of natively supported chains for HyperSync\n" +
  "- HyperRPC/hyperrpc-supported-networks → list of natively supported chains for HyperRPC\n" +
  "- HyperIndex/rpc-data-source / 'index any EVM chain with RPC' → fallback for any EVM chain not natively supported (use a standard JSON-RPC endpoint)\n\n" +
  "## RULES\n" +
  "1. Output 3-5 search queries, one per line. No numbering, no bullets, no explanation.\n" +
  "2. Each query is 2-6 words. Mix specific jargon and broader phrasings.\n" +
  "3. Translate plain language into Envio jargon: 'external calls' → 'Effect API', 'fetch on-chain data' → 'eth_call', 'reorgs' → 'rollback on reorg', 'batch fetching' → 'loaders', 'fast sync' → 'HyperSync', 'deploy' / 'hosted service' / 'envio cloud' → all three.\n" +
  "4. For 'how do I X' questions, ALWAYS include at least one procedural-form query like 'X step by step', 'X instructions', 'X walkthrough', 'X setup'.\n" +
  "5. If the question implies a UI flow vs CLI flow (or vice versa), generate queries for that specific flow: e.g. 'GitHub app deployment', 'envio app login organization' for UI; 'envio-cloud-cli deploy' for CLI.\n" +
  "5b. **For compound questions** (e.g. \"how do I X. also what about Y?\", \"... and what plan should I use?\", multiple distinct asks separated by 'also'/'and then'): identify each sub-topic and generate at least one targeted query per sub-topic. Don't focus only on the first part. Aim for 5-7 total queries when the question has multiple parts.\n" +
  "5a. **For chain-support questions** (e.g. 'is X supported', 'does envio support Y', 'can I index Z chain', 'what chains are supported'): ALWAYS include queries that surface BOTH (a) the supported-networks lists AND (b) the RPC fallback page — e.g. 'HyperSync supported networks', 'HyperRPC supported networks', 'index any EVM chain with RPC'. The RPC fallback matters because users can index any EVM chain via standard JSON-RPC even if it's not in the native list.\n" +
  "6. Make at least one query SHORT (2-3 words) for broad semantic matching.\n" +
  "7. Diverse phrasings: cover different angles of the same question.\n\n" +
  "## EXAMPLES\n\n" +
  "User: how do i make external calls in my indexer\n" +
  "Effect API\n" +
  "external calls handler\n" +
  "eth_call from handler\n" +
  "Viem fetch on-chain\n" +
  "preload optimization external\n\n" +
  "User: how do i deploy to envio cloud using the ui not the cli\n" +
  "hosted service deployment\n" +
  "deploy GitHub app step by step\n" +
  "envio app login organization\n" +
  "Envio Cloud UI walkthrough\n" +
  "deployment instructions GitHub\n\n" +
  "User: how do reorgs work\n" +
  "rollback on reorg\n" +
  "ReorgDetected handler\n" +
  "blockchain reorganization indexer\n" +
  "reorg handling step by step\n\n" +
  "Now generate queries for the user's question. Output ONLY the queries.";

// Detect questions with multiple distinct sub-topics (e.g. "how do I X. also
// what plan should I use?"). When true, retrieval expands its chunk budget so
// each sub-topic gets adequate coverage.
function isCompoundQuestion(q) {
  if (!q) return false;
  const lc = q.toLowerCase();
  return (
    /\b(also|additionally|plus|as well as|moreover|secondly|further(more)?)\b/.test(lc) ||
    /(\?.*\?)/s.test(lc) ||
    /\.\s+(also|additionally|and)\b/i.test(lc)
  );
}

// Deterministic queries forced into the search set when certain topics are
// detected — backstops the rewriter when it fails to include the obvious one.
function deterministicQueriesFor(question) {
  const q = question.toLowerCase();
  const extra = [];
  // Chain / network support: always probe the supported-networks lists AND the
  // any-EVM-with-RPC fallback page, regardless of what the rewriter produced.
  if (/\b(support(ed|s)?|compatible|works with|chain|chains|network|networks|non[- ]?evm|solana|fuel)\b/.test(q)) {
    extra.push("any EVM with RPC");
    extra.push("HyperSync supported networks");
    extra.push("HyperRPC supported networks");
  }
  return extra;
}

async function generateSearchQueries(question, history, groqKey) {
  try {
    const messages = [{ role: "system", content: QUERY_REWRITE_SYSTEM_PROMPT }];
    if (history.length > 0) {
      messages.push({
        role: "system",
        content:
          "PRIOR CONVERSATION (most recent last):\n" +
          history.map((m) => `${m.role.toUpperCase()}: ${m.content}`).join("\n\n"),
      });
    }
    messages.push({ role: "user", content: question });

    const res = await fetch(GROQ_URL, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${groqKey}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: GROQ_FAST_MODEL,
        stream: false,
        temperature: 0.3,
        max_tokens: 200,
        messages,
      }),
    });
    if (!res.ok) return [question];
    const data = await res.json();
    const text = data?.choices?.[0]?.message?.content || "";
    const lines = text
      .split("\n")
      .map((l) => l.trim().replace(/^[-*\d.)\s"`]+/, "").replace(/["`]+$/, ""))
      .filter((l) => l.length >= 2 && l.length <= 80);
    const seen = new Set([question.toLowerCase()]);
    const unique = [];
    for (const l of lines) {
      const k = l.toLowerCase();
      if (!seen.has(k)) {
        seen.add(k);
        unique.push(l);
      }
      const cap = isCompoundQuestion(question) ? 5 : MAX_REWRITTEN_QUERIES;
      if (unique.length >= cap) break;
    }
    // Inject deterministic backstop queries (for topics like chain support
    // where we know exactly which page should be hit, regardless of rewriter).
    const deterministic = deterministicQueriesFor(question);
    for (const dq of deterministic) {
      const k = dq.toLowerCase();
      if (!seen.has(k)) {
        seen.add(k);
        unique.push(dq);
      }
    }
    return [question, ...unique];
  } catch {
    return [question, ...deterministicQueriesFor(question)];
  }
}

async function retrieveDocsContext(question, history, groqKey) {
  const queries = await generateSearchQueries(question, history, groqKey);
  console.log(`\n[chat] Q: "${question}"`);
  console.log(`[chat] queries (${queries.length}):`);
  queries.forEach((q, i) => console.log(`  ${i + 1}. ${q}`));

  await mcpRequest(
    "initialize",
    {
      protocolVersion: "2025-03-26",
      capabilities: {},
      clientInfo: { name: "envio-docs-chat", version: "1.0.0" },
    },
    1
  );

  const searchResults = await Promise.all(
    queries.map((q, i) =>
      mcpRequest(
        "tools/call",
        {
          name: "search_docs",
          arguments: { library: MCP_LIBRARY, query: q, limit: SEARCH_LIMIT_PER_QUERY },
        },
        10 + i
      )
        .then((resp) => ({ query: q, text: extractToolText(resp) }))
        .catch(() => ({ query: q, text: "" }))
    )
  );

  console.log(`[chat] hits per query:`);
  searchResults.forEach((sr) => {
    const urls = extractUrlsFromSearch(sr.text);
    console.log(`  "${sr.query}" → ${urls.length}${urls.length ? ":" : ""}`);
    urls.forEach((u) => console.log(`     - ${u}`));
  });

  // Detect section affinities (HyperSync / HyperRPC / hosted-service / troubleshoot / etc.)
  const sectionPatterns = detectSectionAffinities(question);
  if (sectionPatterns.length > 0) {
    console.log(`[chat] section affinities: ${sectionPatterns.map((p) => p.toString()).join(", ")}`);
  }

  // Compound questions need wider context coverage — each sub-topic deserves its own chunks.
  const compound = isCompoundQuestion(question);
  const fusedCap = compound ? Math.max(MAX_FUSED_CHUNKS, 12) : MAX_FUSED_CHUNKS;
  const contextCap = compound ? Math.max(MAX_DOCS_CONTEXT_CHAR, 20000) : MAX_DOCS_CONTEXT_CHAR;
  if (compound) console.log(`[chat] compound question detected — expanding to ${fusedCap} chunks / ${contextCap} chars`);

  // Fuse: dedupe by URL, rank by RRF + slug-keyword bonus + section-affinity bonus.
  const fused = fuseSearchResults(searchResults, question);
  const top = fused.slice(0, fusedCap);

  console.log(`[chat] fused: ${fused.length} unique URLs, top ${top.length}:`);
  top.forEach((t) => {
    const tag = t.queriesHit > 1 ? ` ★${t.queriesHit}q` : "";
    console.log(`  - [${t.score.toFixed(3)}]${tag} ${t.url}`);
  });

  let docsBlock;
  if (top.length === 0) {
    console.log(`[chat] no docs content found`);
    docsBlock = "No relevant documentation found.";
  } else {
    const blocks = top.map((t) => {
      const tag = t.queriesHit > 1 ? ` (matched ${t.queriesHit} of ${searchResults.length} queries)` : "";
      const trimmed = t.content.slice(0, PER_CHUNK_CHAR_BUDGET);
      return `### Source: ${t.url}${tag}\n${trimmed}`;
    });
    let assembled = blocks.join("\n\n---\n\n");
    if (assembled.length > contextCap) {
      console.log(`[chat] context truncated: ${assembled.length} → ${contextCap} chars`);
      assembled = assembled.slice(0, contextCap) + "\n\n…[truncated]";
    } else {
      console.log(`[chat] context: ${assembled.length} chars (${top.length} sources)`);
    }
    docsBlock = assembled;
  }

  // For pricing-related questions, fetch the relevant envio.dev/pricing pages
  // and append their content (pricing data isn't in the docs MCP).
  if (detectPricingIntent(question)) {
    console.log(`[chat] pricing intent detected`);
    const pricingBlock = await retrievePricingContext(question);
    if (pricingBlock) {
      return docsBlock + "\n\n## PRICING INFORMATION (from envio.dev/pricing — authoritative for pricing)\n" + pricingBlock;
    }
  }

  return docsBlock;
}

function writeSseJson(res, data) {
  res.write(`data: ${JSON.stringify(data)}\n\n`);
}

function writeSseDone(res) {
  res.write("data: [DONE]\n\n");
}

// Strips any reasoning/thinking-style tag blocks from streamed model output.
// Models like Gemma sometimes emit <thought>...</thought> wrappers despite prompt
// instructions; this is a stateful filter that survives chunk boundaries.
const REASONING_TAGS = ["thought", "thinking", "think", "reasoning", "plan", "scratchpad"];
const REASONING_OPEN_RE = new RegExp(`<(${REASONING_TAGS.join("|")})>`, "i");
const REASONING_CLOSE_RE = new RegExp(`</(${REASONING_TAGS.join("|")})>`, "i");

function createReasoningStripper() {
  let inside = false;
  let pending = "";

  return function strip(text) {
    let buf = pending + text;
    pending = "";
    let out = "";

    while (buf.length > 0) {
      if (inside) {
        const m = buf.match(REASONING_CLOSE_RE);
        if (m) {
          buf = buf.slice(m.index + m[0].length);
          inside = false;
        } else {
          // Close tag may be split across chunks — keep tail in case.
          pending = buf.slice(-30);
          buf = "";
        }
      } else {
        const m = buf.match(REASONING_OPEN_RE);
        if (m) {
          out += buf.slice(0, m.index);
          buf = buf.slice(m.index + m[0].length);
          inside = true;
        } else {
          // No open tag — but a partial tag could be at the end of buf.
          const lastLt = buf.lastIndexOf("<");
          if (lastLt !== -1 && buf.length - lastLt < 20) {
            out += buf.slice(0, lastLt);
            pending = buf.slice(lastLt);
          } else {
            out += buf;
          }
          buf = "";
        }
      }
    }
    return out;
  };
}

// Replace fancy hyphens (non-breaking U+2011, hyphen U+2010, en/em dashes when
// inside a "word-like" context) with plain ASCII hyphens. Models sometimes
// auto-prettify these, but URLs and code identifiers require ASCII -.
function createHyphenNormalizer() {
  return function normalize(text) {
    return text.replace(/[‐‑]/g, "-");
  };
}

// Strip stray `[slug-like-text]` brackets that aren't followed by `(url)`.
// Models occasionally write `[migrate-to-v3]` intending a link but forget the
// URL. Without this filter, that renders as literal text in markdown.
// Stateful: buffers across chunks so we can peek at the char after `]`.
function createBracketCleanupFilter() {
  let pending = "";
  return function clean(text) {
    let buf = pending + text;
    pending = "";
    let out = "";
    while (buf.length > 0) {
      const open = buf.indexOf("[");
      if (open === -1) { out += buf; break; }
      out += buf.slice(0, open);
      buf = buf.slice(open);
      const close = buf.indexOf("]");
      // No `]` yet — buffer if reasonable, else flush.
      if (close === -1) {
        if (buf.length < 100) { pending = buf; break; }
        out += buf; break;
      }
      // We have `]`. Need to peek at the next char to decide.
      if (close + 1 >= buf.length) {
        if (buf.length < 100) { pending = buf; break; }
        out += buf; break;
      }
      const inner = buf.slice(1, close);
      const after = buf[close + 1];
      const isSlugLike = /^[A-Za-z0-9_-]{3,}$/.test(inner);
      if (after === "(") {
        // Real markdown link — emit `[inner](` and let the rest stream.
        out += buf.slice(0, close + 2);
        buf = buf.slice(close + 2);
      } else if (isSlugLike) {
        // Stray slug brackets — emit just the inner text (strip the brackets).
        out += inner;
        buf = buf.slice(close + 1);
      } else {
        // Some other bracketed content (e.g. `[note: ...]`) — leave it.
        out += buf.slice(0, close + 1);
        buf = buf.slice(close + 1);
      }
    }
    return out;
  };
}

// Derive a human-meaningful link label from a docs URL: prefer the last path
// segment (e.g. "common-issues") over generic words like "source"/"here".
function deriveLinkLabel(url) {
  try {
    const segments = new URL(url).pathname.split("/").filter(Boolean);
    return segments[segments.length - 1] || "docs";
  } catch {
    return "docs";
  }
}

// Some models (DeepSeek, Qwen, occasionally GPT-OSS) emit citation markers as
// 【url】 — CJK brackets that don't render as markdown links. This filter
// converts them mid-stream to standard markdown link syntax. Stateful so
// brackets split across SSE chunks are still caught.
function createCitationBracketFilter() {
  let pending = "";

  return function filter(text) {
    let buf = pending + text;
    pending = "";
    let out = "";

    while (buf.length > 0) {
      const openIdx = buf.indexOf("【");
      if (openIdx === -1) {
        out += buf;
        break;
      }

      out += buf.slice(0, openIdx);
      const closeIdx = buf.indexOf("】", openIdx + 1);

      if (closeIdx === -1) {
        // Closing bracket hasn't arrived yet — buffer for next chunk.
        // But cap pending so we don't hold forever if the model never closes it.
        const tail = buf.slice(openIdx);
        if (tail.length > 500) {
          out += tail; // give up waiting; emit raw
        } else {
          pending = tail;
        }
        break;
      }

      const inner = buf.slice(openIdx + 1, closeIdx);
      buf = buf.slice(closeIdx + 1);

      // Try to extract a URL from the bracket contents and convert to markdown link.
      const urlMatch = inner.match(/(https?:\/\/\S+?)(?:[)\].,;]+)?$/);
      if (urlMatch) {
        const label = deriveLinkLabel(urlMatch[1]);
        out += ` ([${label}](${urlMatch[1]}))`;
      } else if (inner.trim().length > 0) {
        // No URL inside — drop the brackets, keep the inner content as a parenthetical.
        out += ` (${inner.trim()})`;
      }
      // If inner was empty, drop the brackets entirely.
    }
    return out;
  };
}

// Apply a chain of filters to the content of a single SSE event. Filters run
// left-to-right (output of one feeds into the next). Each is stateful and
// survives chunk boundaries.
function filterSseEvent(eventText, filters) {
  const lines = eventText.split("\n");
  const out = lines.map((line) => {
    if (!line.startsWith("data: ")) return line;
    const payload = line.slice(6);
    if (payload.trim() === "[DONE]") return line;
    try {
      const parsed = JSON.parse(payload);
      const delta = parsed?.choices?.[0]?.delta?.content;
      if (typeof delta === "string") {
        let text = delta;
        for (const f of filters) text = f(text);
        parsed.choices[0].delta.content = text;
      }
      return "data: " + JSON.stringify(parsed);
    } catch {
      return line;
    }
  });
  return out.join("\n");
}

const SYSTEM_PROMPT_PREAMBLE =
  "You are the Envio documentation assistant. You answer developer questions about Envio's products (HyperIndex, HyperSync, HyperRPC, Envio Cloud) using ONLY the documentation provided below.\n\n" +
  "## RULES — answers violating any of these are considered wrong\n\n" +
  "1. **No fabrication.** Use only what is literally written in the documentation below. If a CLI command, flag, env var, file name, config key, or UI label is not in the docs, don't mention it. If the docs don't cover the question at all, reply with exactly: \"I don't see this covered in the documentation.\" — nothing else.\n\n" +
  "2. **Inline markdown links with meaningful labels.** The documentation below is split into sections, each headed by `### Source: <url>`. When your answer references content from a section, the sentence that introduces it MUST contain a markdown link to its Source URL.\n" +
  "   - Bare URLs are forbidden — always wrap: write `[the Envio app](https://envio.dev/app)`, never `https://envio.dev/app`.\n" +
  "   - **The link text MUST name the thing being linked** — the page name, feature name, or concept (e.g., `[Effect API]`, `[organisation-setup]`, `[hosted service deployment]`, `[common-issues]`). NEVER use generic labels like `[source]`, `[here]`, `[click here]`, `[this page]`, `[link]`, `[docs]`, `[the documentation]`. If unsure, use the slug from the URL (e.g. for `…/effect-api` use `[effect-api]`).\n" +
  "   - Never use CJK brackets 【】, parenthetical citation markers like `(source: …)`, or footnote-style annotations — always use standard markdown link syntax `[label](url)`.\n" +
  "   - **Never write `[text]` without an immediately following `(url)`.** A link without a URL is broken markdown. If you don't know the URL, write the text plain — no brackets.\n" +
  "   - **Use ASCII hyphens `-` only.** Never use non-breaking hyphens, en-dashes, or em-dashes inside slugs, identifiers, or URLs.\n\n" +
  "3. **Verbatim steps for how-to questions.** If the docs say \"Click Add next to each person\", write \"Click Add next to each person\". Don't rephrase to \"Click the Add button\" or \"press Add\". Keep numbering and exact UI labels.\n\n" +
  "4. **Fenced code blocks with a language tag.** Even one-liners. Tags: `ts`, `js`, `yaml`, `bash`, `json`, `sql`, `graphql`, `rs`, `py`. Use inline `code` for identifiers and short references in prose.\n\n" +
  "5. **No trailing references section.** Don't end with \"Learn more:\", \"See also:\", \"For more information:\", \"References:\" or any synonym. All links go inline within the body of explanatory sentences.\n\n" +
  "6. **No reasoning tags or scratchpad.** Don't emit `<thought>`, `<thinking>`, `<reasoning>`, `<plan>`, `<scratchpad>`, etc. Start the reply with the actual answer.\n\n" +
  "7. **Use formatting:** **bold** for important terms (file names, commands, env vars, UI labels), inline `code` for identifiers.\n\n" +
  "## EXAMPLE\n\n" +
  "Suppose the documentation block contains:\n" +
  "```\n" +
  "### Source: https://docs.envio.dev/docs/HyperIndex/effect-api\n" +
  "The Effect API lets your handlers run external calls in parallel. Define an effect with experimental_createEffect, then call it from any handler:\n" +
  "const balanceEffect = experimental_createEffect({ name: \"balance\", ... })\n" +
  "```\n\n" +
  "User asks: \"How do I make external calls from my indexer?\"\n\n" +
  "GOOD answer:\n" +
  "> Use the [Effect API](https://docs.envio.dev/docs/HyperIndex/effect-api). Define an effect with `experimental_createEffect`, then call it from any handler:\n" +
  "> \n" +
  "> ```ts\n" +
  "> const balanceEffect = experimental_createEffect({ name: \"balance\", ... })\n" +
  "> ```\n\n" +
  "BAD answer (violates the rules):\n" +
  "> External calls are done via the Effect API. You can use experimental_createEffect.\n" +
  "> \n" +
  "> Learn more: https://docs.envio.dev/docs/HyperIndex/effect-api\n\n" +
  "Why bad: no inline markdown link, raw URL, trailing \"Learn more\", code not fenced.\n\n" +
  "## SPECIAL CASES\n\n" +
  "- **Pricing**: if a `## PRICING INFORMATION` block appears below, it's the authoritative source for prices, plans, and tiers. Quote names, prices, and limits exactly. Link to `https://envio.dev/pricing/<product>` inline using markdown.\n" +
  "- **API keys / tokens**: API keys (HyperSync tokens, package tokens, access tokens) are managed in the Envio Cloud UI, not via docs or CLI. Direct the user to `https://envio.dev/app/<your-org-id>/~/hypersync/tokens` — keep the `<your-org-id>` placeholder so they substitute their actual slug. Wrap the URL as a markdown link.\n" +
  "- **Chain / network support**: when the user asks if Envio supports a particular chain (or asks for the list of supported chains), your answer MUST cover BOTH options: (1) check the relevant supported-networks list (HyperSync or HyperRPC) and (2) note that even if a chain isn't in the native list, any EVM chain can be indexed via a standard JSON-RPC endpoint (link to the 'index any EVM chain with RPC' page in the docs context). Always link both pages inline using markdown when they appear in the documentation context below.\n\n" +
  "## REMINDERS\n" +
  "Inline markdown links. Verbatim steps. Fenced code. No trailing references. No fabrication.\n\n" +
  "---\nDOCUMENTATION CONTENT:\n";

// Try each main provider in order. Return the first OK streaming response, or null.
async function callMainModelWithFallback(messages) {
  for (const p of getMainProviders()) {
    let key = null;
    if (p.keyEnv) {
      key = process.env[p.keyEnv];
      if (!key) {
        console.log(`[chat] provider ${p.name}: ${p.keyEnv} not set, skipping`);
        continue;
      }
    }
    const headers = { "Content-Type": "application/json" };
    if (key) headers.Authorization = `Bearer ${key}`;
    try {
      const res = await fetch(p.url, {
        method: "POST",
        headers,
        body: JSON.stringify({
          model: p.model,
          stream: true,
          temperature: 0.2,
          messages,
        }),
      });
      if (res.ok && res.body) {
        console.log(`[chat] provider ${p.name}: OK`);
        return res;
      }
      const errBody = await res.text().catch(() => "<unreadable>");
      console.log(`[chat] provider ${p.name}: status=${res.status} ${res.statusText}`);
      console.log(`[chat] provider ${p.name}: body (first 400): ${errBody.slice(0, 400)}`);
    } catch (err) {
      console.log(`[chat] provider ${p.name}: threw ${err?.message || err}`);
    }
  }
  return null;
}

export default async function handler(req, res) {
  setCors(res);

  if (req.method === "OPTIONS") {
    res.status(204).end();
    return;
  }
  if (req.method !== "POST") {
    res.status(405).json({ error: "Method not allowed" });
    return;
  }

  let body = req.body;
  if (typeof body === "string") {
    try {
      body = JSON.parse(body);
    } catch {
      body = {};
    }
  }
  const question = typeof body?.question === "string" ? body.question.trim() : "";
  if (!question) {
    res.status(400).json({ error: "Missing or invalid 'question'" });
    return;
  }

  const history = sanitizeHistory(body?.history);

  const groqKey = process.env.GROQ_API_KEY;
  if (!groqKey) {
    res.status(500).json({ error: "GROQ_API_KEY not configured (needed for query rewriting)" });
    return;
  }

  // Run docs retrieval and history compression in parallel — both take the
  // same kind of time (~300-700ms) so the total cost is max() not sum().
  // Rewriter sees the raw history (it only really uses user questions for
  // pronoun resolution, which are always short).
  // Main model gets the compressed history (older AI responses summarized).
  let docsContext;
  let compressedHistory = history;
  try {
    [docsContext, compressedHistory] = await Promise.all([
      retrieveDocsContext(question, history, groqKey),
      compressHistory(history, groqKey),
    ]);
  } catch {
    docsContext = "No relevant documentation found.";
  }

  res.setHeader("Content-Type", "text/event-stream");
  res.setHeader("Cache-Control", "no-cache, no-transform");
  res.setHeader("Connection", "keep-alive");
  res.flushHeaders?.();

  const systemPrompt = SYSTEM_PROMPT_PREAMBLE + docsContext;
  const messages = [
    { role: "system", content: systemPrompt },
    ...compressedHistory,
    { role: "user", content: question },
  ];

  const modelRes = await callMainModelWithFallback(messages);

  if (!modelRes) {
    writeSseJson(res, {
      error: "All language model providers are currently unavailable. Please try again in a minute.",
    });
    writeSseDone(res);
    res.end();
    return;
  }

  // Stream through a filter chain:
  // 1. Strip <thought>/<thinking>/etc. reasoning blocks
  // 2. Normalize fancy hyphens (U+2010/U+2011) → ASCII `-`
  // 3. Convert CJK 【url】 citation brackets to standard markdown links
  // 4. Strip stray `[slug]` brackets that aren't followed by `(url)`
  const filters = [
    createReasoningStripper(),
    createHyphenNormalizer(),
    createCitationBracketFilter(),
    createBracketCleanupFilter(),
  ];
  const decoder = new TextDecoder();
  let buffer = "";

  try {
    for await (const chunk of modelRes.body) {
      buffer += decoder.decode(chunk, { stream: true });

      let sepIdx;
      while ((sepIdx = buffer.indexOf("\n\n")) !== -1) {
        const event = buffer.slice(0, sepIdx);
        buffer = buffer.slice(sepIdx + 2);
        res.write(filterSseEvent(event, filters) + "\n\n");
      }
    }
    if (buffer.length > 0) {
      res.write(filterSseEvent(buffer, filters));
    }
  } catch {
    writeSseJson(res, { error: "Stream interrupted." });
  } finally {
    res.end();
  }
}
