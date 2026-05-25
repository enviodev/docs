import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { StreamableHTTPServerTransport } from "@modelcontextprotocol/sdk/server/streamableHttp.js";
import FlexSearch from "flexsearch";
import fs from "fs-extra";
import path from "path";
import { fileURLToPath } from "url";
import { z } from "zod";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const projectRoot = path.join(__dirname, "..");

const DOCS_PATH = path.join(projectRoot, "build/mcp/docs.json");
const INDEX_PATH = path.join(projectRoot, "build/mcp/search-index.json");
const BASE_URL = "https://docs.envio.dev";

// --- Content cleaning ---

// Docusaurus appends anchor links to headings:
//   ## My Heading​[](/docs/foo#my-heading "Direct link to My Heading")
const HEADING_ANCHOR_RE =
  /[ ​]*\[\]\([^)]*?"Direct link to [^"]*?"\)/g;
const ZWS_RE = /​/g;

function cleanText(text) {
  return text.replace(HEADING_ANCHOR_RE, "").replace(ZWS_RE, "").trim();
}

function cleanDocs(docs) {
  const cleaned = {};
  for (const [url, doc] of Object.entries(docs)) {
    cleaned[url] = {
      ...doc,
      headings: doc.headings.map((h) => ({ ...h, text: cleanText(h.text) })),
      markdown: cleanText(doc.markdown),
    };
  }
  return cleaned;
}

// --- Search (mirrors upstream FlexSearch config exactly) ---

function englishStemmer(word) {
  if (word.length <= 3) return word;
  return word
    .replace(/ing$/, "")
    .replace(/tion$/, "t")
    .replace(/sion$/, "s")
    .replace(/([^aeiou])ed$/, "$1")
    .replace(/([^aeiou])es$/, "$1")
    .replace(/ly$/, "")
    .replace(/ment$/, "")
    .replace(/ness$/, "")
    .replace(/ies$/, "y")
    .replace(/([^s])s$/, "$1");
}

function createSearchIndex() {
  return new FlexSearch.Document({
    tokenize: "forward",
    cache: 100,
    resolution: 9,
    context: { resolution: 2, depth: 2, bidirectional: true },
    encode: (str) => {
      const words = str.toLowerCase().split(/[\s\-_.,;:!?'"()[\]{}]+/);
      return words.filter(Boolean).map(englishStemmer);
    },
    document: {
      id: "id",
      index: ["title", "content", "headings", "description"],
      store: ["title", "description"],
    },
  });
}

const FIELD_WEIGHTS = { title: 3, headings: 2, description: 1.5, content: 1 };

function searchDocs(index, docs, query, limit = 16) {
  const rawResults = index.search(query, { limit: limit * 3, enrich: true });
  const docScores = new Map();
  for (const fieldResult of rawResults) {
    const weight = FIELD_WEIGHTS[fieldResult.field] ?? 1;
    const results = fieldResult.result;
    for (let i = 0; i < results.length; i++) {
      const item = results[i];
      if (!item) continue;
      const docId = typeof item === "string" ? item : item.id;
      const positionScore = (results.length - i) / results.length;
      docScores.set(
        docId,
        (docScores.get(docId) ?? 0) + positionScore * weight,
      );
    }
  }
  const ranked = [];
  for (const [docId, score] of docScores) {
    const doc = docs[docId];
    if (!doc) continue;
    ranked.push({
      url: docId,
      title: doc.title,
      description: doc.description,
      score,
    });
  }
  ranked.sort((a, b) => b.score - a.score);
  return ranked.slice(0, limit);
}

// --- Formatting ---

function formatSearchResults(results) {
  if (results.length === 0) return "No matching documents found.";
  const lines = [`Found ${results.length} result(s):\n`];
  for (let i = 0; i < results.length; i++) {
    const r = results[i];
    lines.push(`${i + 1}. **${r.title}**`);
    lines.push(`   URL: ${r.url}`);
    if (r.description) {
      lines.push(`   ${r.description}`);
    }
    lines.push("");
  }
  lines.push("Use docs_fetch with the URL to retrieve the full page content.");
  return lines.join("\n");
}

function formatPageContent(doc) {
  if (!doc) return "Page not found. Please check the URL and try again.";
  const lines = [`# ${doc.title}`, ""];
  if (doc.description) {
    lines.push(`> ${doc.description}`, "");
  }
  lines.push(doc.markdown);
  return lines.join("\n");
}

// --- Server lifecycle ---

let state = null;

async function init() {
  if (state) return state;

  const [rawDocs, indexData] = await Promise.all([
    fs.readJson(DOCS_PATH),
    fs.readJson(INDEX_PATH),
  ]);

  const docs = cleanDocs(rawDocs);

  const index = createSearchIndex();
  for (const [key, value] of Object.entries(indexData)) {
    await index.import(key, value);
  }

  const mcp = new McpServer(
    { name: "envio-docs", version: "1.0.0" },
    { capabilities: { tools: {} } },
  );

  mcp.registerTool(
    "docs_search",
    {
      description:
        "Search the documentation for relevant pages. Returns matching documents with URLs, summaries, and relevance scores. Use this to find information across all documentation.",
      inputSchema: {
        query: z.string().min(1).describe("The search query string"),
        limit: z
          .number()
          .int()
          .min(1)
          .max(20)
          .optional()
          .default(16)
          .describe("Maximum number of results to return (1-20, default: 16)"),
      },
    },
    async ({ query, limit }) => {
      const results = searchDocs(index, docs, query, limit);
      return {
        content: [{ type: "text", text: formatSearchResults(results) }],
      };
    },
  );

  mcp.registerTool(
    "docs_fetch",
    {
      description:
        "Fetch the complete content of a documentation page as markdown. Use this after searching to get the full content of a specific page.",
      inputSchema: {
        url: z
          .string()
          .url()
          .describe(
            'The full URL of the page to fetch (e.g., "https://docs.envio.dev/docs/getting-started")',
          ),
      },
    },
    async ({ url }) => {
      const doc = docs[url] ?? null;
      return {
        content: [{ type: "text", text: formatPageContent(doc) }],
      };
    },
  );

  state = { mcp, docs, index };
  return state;
}

// --- Vercel handler ---

const CORS_HEADERS = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "GET, POST, OPTIONS",
  "Access-Control-Allow-Headers": "Content-Type",
};

export default async function handler(req, res) {
  Object.entries(CORS_HEADERS).forEach(([k, v]) => res.setHeader(k, v));

  if (req.method === "OPTIONS") {
    res.writeHead(204);
    return res.end();
  }

  if (req.method === "GET") {
    try {
      const { docs } = await init();
      return res.status(200).json({
        name: "envio-docs",
        version: "1.0.0",
        initialized: true,
        docCount: Object.keys(docs).length,
        baseUrl: BASE_URL,
      });
    } catch (error) {
      console.error("MCP Server Error:", error);
      return res.status(500).json({
        jsonrpc: "2.0",
        id: null,
        error: {
          code: -32603,
          message: `Internal server error: ${error.message ?? error}`,
        },
      });
    }
  }

  if (req.method !== "POST") {
    return res.status(405).json({
      jsonrpc: "2.0",
      id: null,
      error: {
        code: -32600,
        message: "Method not allowed. Use POST for MCP requests, GET for status.",
      },
    });
  }

  try {
    const { mcp } = await init();
    const transport = new StreamableHTTPServerTransport({
      sessionIdGenerator: undefined,
      enableJsonResponse: true,
    });
    await mcp.connect(transport);
    try {
      await transport.handleRequest(req, res, req.body);
    } finally {
      await transport.close();
    }
  } catch (error) {
    console.error("MCP Server Error:", error);
    return res.status(500).json({
      jsonrpc: "2.0",
      id: null,
      error: {
        code: -32603,
        message: `Internal server error: ${error.message ?? error}`,
      },
    });
  }
}
