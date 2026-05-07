const MCP_URL = "http://localhost:6280/mcp";
const MCP_LIBRARY = "envio-docs-no-llm-completes";

const GEMINI_URL = "https://generativelanguage.googleapis.com/v1beta/openai/chat/completions";
const GROQ_URL = "https://api.groq.com/openai/v1/chat/completions";
const GROQ_FAST_MODEL = "llama-3.1-8b-instant";

// Main streaming providers, tried in order. First success commits.
// Gemini variants share a daily quota but have independent server-load pools,
// so the older variants tend to be available when the headline model is busy.
const MAIN_PROVIDERS = [
  { name: "gemini-2.5-flash",      url: GEMINI_URL, model: "gemini-2.5-flash",      keyEnv: "GOOGLE_API_KEY" },
  { name: "gemini-2.0-flash",      url: GEMINI_URL, model: "gemini-2.0-flash",      keyEnv: "GOOGLE_API_KEY" },
  { name: "gemini-2.0-flash-lite", url: GEMINI_URL, model: "gemini-2.0-flash-lite", keyEnv: "GOOGLE_API_KEY" },
  { name: "groq",                  url: GROQ_URL,   model: "llama-3.3-70b-versatile", keyEnv: "GROQ_API_KEY" },
];

const SEARCH_LIMIT_PER_QUERY = 4;
const MAX_REWRITTEN_QUERIES = 3;
const MAX_DOCS_CONTEXT_CHAR = 14000;     // overall safety cap on the fused context
const PER_CHUNK_CHAR_BUDGET = 1800;      // per-URL chunk cap so one page can't dominate
const MAX_FUSED_CHUNKS = 8;              // how many unique URLs to include after fusion

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

// Fuse search results across queries. Dedupes by URL, scores by query-consensus
// (URL appearing in more queries ranks higher), tie-breaks by best position.
// Returns an array of { url, content, queriesHit, bestPosition } sorted best-first.
function fuseSearchResults(searchResults) {
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
        });
      }
      const info = urlMap.get(r.url);
      info.contents.push(r.content);
      info.queriesHit.add(qIdx);
      if (posIdx < info.bestPosition) info.bestPosition = posIdx;
    });
  });

  return [...urlMap.values()]
    .map((info) => ({
      url: info.url,
      // Pick the longest content snippet for this URL across all queries that returned it.
      content: info.contents.reduce((a, b) => (a.length > b.length ? a : b), ""),
      queriesHit: info.queriesHit.size,
      bestPosition: info.bestPosition,
    }))
    .sort((a, b) => {
      if (b.queriesHit !== a.queriesHit) return b.queriesHit - a.queriesHit;
      return a.bestPosition - b.bestPosition;
    });
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

async function retrievePricingContext(question) {
  const products = detectPricingProducts(question);
  const fetched = await Promise.all(
    products.map(async (p) => ({
      product: p,
      url: PRICING_URLS[p],
      text: await fetchPricingPage(PRICING_URLS[p]),
    }))
  );
  const ok = fetched.filter((f) => f.text);
  if (ok.length === 0) return "";
  return ok
    .map((f) => `### ${f.product} pricing — source: ${f.url}\n${f.text}`)
    .join("\n\n---\n\n");
}

const QUERY_REWRITE_SYSTEM_PROMPT =
  "You generate documentation search queries for the Envio docs (HyperIndex, HyperSync, HyperRPC, Envio Cloud / hosted service).\n\n" +
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
  "- multichain-indexing → multichain config\n\n" +
  "## RULES\n" +
  "1. Output 3-5 search queries, one per line. No numbering, no bullets, no explanation.\n" +
  "2. Each query is 2-6 words. Mix specific jargon and broader phrasings.\n" +
  "3. Translate plain language into Envio jargon: 'external calls' → 'Effect API', 'fetch on-chain data' → 'eth_call', 'reorgs' → 'rollback on reorg', 'batch fetching' → 'loaders', 'fast sync' → 'HyperSync', 'deploy' / 'hosted service' / 'envio cloud' → all three.\n" +
  "4. For 'how do I X' questions, ALWAYS include at least one procedural-form query like 'X step by step', 'X instructions', 'X walkthrough', 'X setup'.\n" +
  "5. If the question implies a UI flow vs CLI flow (or vice versa), generate queries for that specific flow: e.g. 'GitHub app deployment', 'envio app login organization' for UI; 'envio-cloud-cli deploy' for CLI.\n" +
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

async function generateSearchQueries(question, groqKey) {
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
        temperature: 0.3,
        max_tokens: 200,
        messages: [
          { role: "system", content: QUERY_REWRITE_SYSTEM_PROMPT },
          { role: "user", content: question },
        ],
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
      if (unique.length >= MAX_REWRITTEN_QUERIES) break;
    }
    return [question, ...unique];
  } catch {
    return [question];
  }
}

async function retrieveDocsContext(question, groqKey) {
  const queries = await generateSearchQueries(question, groqKey);

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

  // Fuse: dedupe by URL across queries, rank by query-consensus, take top N.
  const fused = fuseSearchResults(searchResults);
  const top = fused.slice(0, MAX_FUSED_CHUNKS);

  let docsBlock;
  if (top.length === 0) {
    docsBlock = "No relevant documentation found.";
  } else {
    const blocks = top.map((t) => {
      const tag = t.queriesHit > 1 ? ` (matched ${t.queriesHit} of ${searchResults.length} queries)` : "";
      const trimmed = t.content.slice(0, PER_CHUNK_CHAR_BUDGET);
      return `### Source: ${t.url}${tag}\n${trimmed}`;
    });
    let assembled = blocks.join("\n\n---\n\n");
    if (assembled.length > MAX_DOCS_CONTEXT_CHAR) {
      assembled = assembled.slice(0, MAX_DOCS_CONTEXT_CHAR) + "\n\n…[truncated]";
    }
    docsBlock = assembled;
  }

  // For pricing-related questions, fetch the relevant envio.dev/pricing pages
  // and append their content (pricing data isn't in the docs MCP).
  if (detectPricingIntent(question)) {
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

const SYSTEM_PROMPT_PREAMBLE =
  "You are an expert assistant for Envio's developer documentation (HyperIndex blockchain indexer, HyperSync, HyperRPC, hosted service / Envio Cloud).\n\n" +
  "## PRIMARY DIRECTIVE\n" +
  "Answer ONLY using the documentation content provided below. Never invent API names, CLI commands, environment variables, file paths, UI labels, configuration keys, or behavior. If a detail is not present in the docs, do NOT include it. Stick to what the docs literally say.\n\n" +
  "## ANSWER STRUCTURE\n" +
  "- For 'how to' / procedural questions: walk through the actual steps from the docs in order. If the docs include UI instructions ('click X', 'select Y', 'navigate to Z', 'choose your organization'), include those exact steps verbatim — do NOT summarize them away.\n" +
  "- For conceptual questions: explain the concept using the docs' own definitions and examples.\n" +
  "- When the docs contain a code snippet relevant to the question, include it inline in a fenced code block with the correct language tag.\n" +
  "- Use **bold** for important terms (file names, command names, env vars, UI labels).\n" +
  "- Use inline `code` for identifiers, function names, file paths.\n\n" +
  "## LINKING\n" +
  "- Link inline using markdown wherever you mention a feature, page, or concept that's in the docs. Example: 'use the [Effect API](https://docs.envio.dev/docs/HyperIndex/effect-api) to fetch on-chain state'.\n" +
  "- Place the link on the relevant phrase in the body, NOT as a closing reference.\n\n" +
  "## PRICING QUESTIONS\n" +
  "- When the user asks about pricing, plans, costs, or tiers, the documentation content below may include a 'PRICING INFORMATION' block sourced from envio.dev/pricing. That block is the AUTHORITATIVE source for prices — use it instead of the docs content for any price/plan/tier figures.\n" +
  "- Quote specific tier names, prices, and limits exactly as they appear in the pricing block. Never round, paraphrase, or make up numbers.\n" +
  "- Link to the relevant pricing page inline (e.g., 'see [hosting pricing](https://envio.dev/pricing/hosting) for current tiers').\n\n" +
  "## API KEYS / TOKENS\n" +
  "- API keys (HyperSync tokens, HyperRPC tokens, package tokens, access tokens) are managed in the Envio Cloud UI, not via the docs or CLI. The docs may not cover where to find them.\n" +
  "- If the user asks how to create, get, view, regenerate, or manage an API key/token, direct them to the **Tokens & Packages** page in their Envio Cloud organization: `https://envio.dev/app/<your-org-id>/~/hypersync/tokens` (they replace `<your-org-id>` with their actual org slug, which they'll see in the URL when logged into https://envio.dev/app).\n" +
  "- If they haven't logged in or created an org yet, tell them to do that first at https://envio.dev/app.\n" +
  "- Never invent or guess an org ID. Always show the URL with the `<your-org-id>` placeholder so the user knows to substitute their own.\n\n" +
  "## STRICTLY FORBIDDEN — these will be considered wrong answers\n" +
  "- Adding ANY trailing closing section, regardless of label. This includes: 'Learn more', 'References', 'See also', 'For more information', 'Additional resources', 'Documentation', or any synonym.\n" +
  "- Closing sentences like 'you can refer to the X documentation', 'for more details, see the Y page', 'visit the Z page'. If you want to point at a page, link inline within the body of an explanatory sentence instead.\n" +
  "- Inventing commands, flags, env vars, file names, or UI elements that are not literally present in the documentation content. If the docs don't mention `envio-cloud deploy`, do not write `envio-cloud deploy`.\n" +
  "- Hand-waving with phrases like 'see this page' without explaining the actual content.\n\n" +
  "## IF THE ANSWER IS NOT IN THE DOCS\n" +
  "Reply with one short sentence: 'I don't see this covered in the documentation.' Do not speculate.\n\n" +
  "## LENGTH\n" +
  "Be focused and complete. Include every step the docs include — don't skip steps for brevity. Don't pad with filler. Don't restate the question.\n\n" +
  "---\nDOCUMENTATION CONTENT:\n";

// Try each main provider in order. Return the first OK streaming response, or null.
async function callMainModelWithFallback(messages) {
  for (const p of MAIN_PROVIDERS) {
    const key = process.env[p.keyEnv];
    if (!key) continue;
    try {
      const res = await fetch(p.url, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${key}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          model: p.model,
          stream: true,
          temperature: 0.3,
          messages,
        }),
      });
      if (res.ok && res.body) return res;
    } catch {
      // fall through to next provider
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

  const groqKey = process.env.GROQ_API_KEY;
  if (!groqKey) {
    res.status(500).json({ error: "GROQ_API_KEY not configured (needed for query rewriting)" });
    return;
  }

  let docsContext;
  try {
    docsContext = await retrieveDocsContext(question, groqKey);
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

  try {
    for await (const chunk of modelRes.body) {
      res.write(chunk);
    }
  } catch {
    writeSseJson(res, { error: "Stream interrupted." });
  } finally {
    res.end();
  }
}
