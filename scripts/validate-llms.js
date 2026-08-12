#!/usr/bin/env node
/**
 * Validates the generated llms files and the hand-authored chain redirects.
 *
 * Runs as `postbuild`, so it sees the real build output rather than a
 * reconstruction of it. Two classes of check:
 *
 *   INTERNAL  Anything decidable from the build output alone. These FAIL the
 *             build, because they are deterministic and a failure means we
 *             would ship a broken file.
 *
 *   EXTERNAL  Anything that depends on another host being up (envio.dev, the
 *             chain API). These only WARN. A transient outage or a rate limit
 *             on someone else's service must never block a docs deploy.
 *
 * The external half exists because the per-chain redirects in vercel.json are a
 * hand-authored snapshot. Chains get added and removed upstream, and nothing
 * else notices when a redirect target stops existing.
 *
 * Usage:
 *   node scripts/validate-llms.js              internal + external
 *   node scripts/validate-llms.js --internal   skip network checks
 */

const fs = require("fs");
const path = require("path");

const ROOT = path.resolve(__dirname, "..");
const BUILD_DIR = path.join(ROOT, "build");
const SITE_URL = "https://docs.envio.dev";
const CHAIN_API = "https://chains.hyperquery.xyz/active_chains";

const SKIP_EXTERNAL =
  process.argv.includes("--internal") || process.env.VALIDATE_LLMS_EXTERNAL === "0";

const errors = [];
const warnings = [];
const fail = (msg) => errors.push(msg);
const warn = (msg) => warnings.push(msg);

/** Pull every markdown link target out of a text file. */
const linksIn = (text) =>
  [...text.matchAll(/\]\((https?:\/\/[^)\s]+)\)/g)].map((m) => m[1]);

// ---------------------------------------------------------------------------
// Internal checks
// ---------------------------------------------------------------------------

function checkFilesExist() {
  const expected = ["llms.txt", "llms-full.txt", "llms-full-blog.txt"];
  for (const name of expected) {
    const p = path.join(BUILD_DIR, name);
    if (!fs.existsSync(p)) {
      fail(`${name} was not generated`);
      continue;
    }
    if (fs.statSync(p).size === 0) fail(`${name} is empty`);
  }
}

function checkStructure(llms) {
  if (!llms.startsWith("# ")) fail("llms.txt does not start with an H1 title");
  if (!/^> /m.test(llms)) fail("llms.txt has no blockquote summary line");

  const sections = [...llms.matchAll(/^(#{2,3}) (.+)$/gm)];
  if (sections.length === 0) fail("llms.txt has no sections");

  // A heading immediately followed by another heading means a selector matched
  // nothing, which is how a whole product silently drops out of the index.
  const lines = llms.split("\n");
  for (const [i, line] of lines.entries()) {
    if (!/^#{2,3} /.test(line)) continue;
    const rest = lines.slice(i + 1);
    const nextHeading = rest.findIndex((l) => /^#{2,3} /.test(l));
    const body = (nextHeading === -1 ? rest : rest.slice(0, nextHeading)).join("\n");
    const isParent = /^#{2} /.test(line) && /^### /.test((rest.find((l) => l.trim()) || ""));
    if (!isParent && !body.includes("- [")) {
      fail(`llms.txt section "${line.replace(/^#+ /, "")}" contains no entries`);
    }
  }

  // The generator falls back to "<Title> section of the docs." when a page has
  // no frontmatter description. That is filler, not a description.
  for (const m of llms.matchAll(/^- \[.+?\]\(.+?\): (.*section of the docs\.)$/gm)) {
    fail(`llms.txt entry uses filler description "${m[1]}" (add a frontmatter description)`);
  }
  for (const m of llms.matchAll(/^- (\[.+?\]\(.+?\)): *$/gm)) {
    fail(`llms.txt entry ${m[1]} has an empty description`);
  }
}

/** Every docs.envio.dev link in llms.txt must exist in the build output. */
function checkInternalLinks(llms) {
  const internal = [...new Set(linksIn(llms))].filter((u) => u.startsWith(SITE_URL));

  for (const url of internal) {
    const rel = url.slice(SITE_URL.length).replace(/^\//, "").split("#")[0];
    if (!rel) continue;

    // Entries point at one of three things: a generated .md twin, a plain
    // asset that ships as-is (the llms-full variants), or, for pages with no
    // twin, the rendered route.
    const candidates = rel.endsWith(".md")
      ? [rel]
      : [rel, path.join(rel, "index.html"), `${rel}.html`];

    if (!candidates.some((c) => fs.existsSync(path.join(BUILD_DIR, c)))) {
      fail(`llms.txt links to ${url}, which is not in the build output`);
    }
  }
}

/**
 * The .md copies are served from a flattened slug URL, so any surviving
 * relative link resolves against the wrong directory and 404s.
 */
function checkMarkdownCopies() {
  const walk = (dir) => {
    if (!fs.existsSync(dir)) return [];
    return fs.readdirSync(dir, { withFileTypes: true }).flatMap((e) => {
      const full = path.join(dir, e.name);
      if (e.isDirectory()) return walk(full);
      return e.isFile() && e.name.endsWith(".md") ? [full] : [];
    });
  };

  for (const file of [...walk(path.join(BUILD_DIR, "docs")), ...walk(path.join(BUILD_DIR, "blog"))]) {
    const text = fs.readFileSync(file, "utf-8");
    const relative = [...text.matchAll(/\]\((\.{1,2}\/[^)\s]+)\)/g)].map((m) => m[1]);
    if (relative.length > 0) {
      const rel = path.relative(BUILD_DIR, file);
      fail(`${rel} still contains relative links (${[...new Set(relative)].join(", ")})`);
    }
  }
}

/**
 * Coverage drift. Anything in the sitemap that llms.txt does not mention is
 * probably a page nobody remembered to add. Deliberate omissions live in
 * SITEMAP_ONLY, so adding one is an explicit decision rather than a silence.
 */
const SITEMAP_ONLY = [
  /^\/$/,
  /^\/blog\/?$/,
  /^\/blog\/tag(\/|$)/,
  /^\/showcase\/?$/,
];

function checkCoverage(llms) {
  const sitemapPath = path.join(BUILD_DIR, "sitemap.xml");
  if (!fs.existsSync(sitemapPath)) {
    warn("sitemap.xml not found, skipping coverage check");
    return;
  }

  const sitemap = fs.readFileSync(sitemapPath, "utf-8");
  const urls = [...sitemap.matchAll(/<loc>([^<]+)<\/loc>/g)].map((m) => m[1]);
  const listed = new Set(
    linksIn(llms).map((u) => u.replace(/\.md$/, "").replace(/\/$/, ""))
  );

  const missing = urls.filter((u) => {
    const route = u.slice(SITE_URL.length) || "/";
    if (SITEMAP_ONLY.some((re) => re.test(route))) return false;
    return !listed.has(u.replace(/\/$/, ""));
  });

  for (const u of missing) {
    warn(`in sitemap but not in llms.txt: ${u}`);
  }
}

// ---------------------------------------------------------------------------
// External checks
// ---------------------------------------------------------------------------

async function head(url) {
  try {
    const res = await fetch(url, { redirect: "follow", signal: AbortSignal.timeout(15000) });
    return res.status;
  } catch (e) {
    return null;
  }
}

async function mapLimit(items, limit, fn) {
  const out = [];
  let i = 0;
  await Promise.all(
    Array.from({ length: Math.min(limit, items.length) }, async () => {
      while (i < items.length) {
        const idx = i++;
        out[idx] = await fn(items[idx]);
      }
    })
  );
  return out;
}

/**
 * The per-chain redirects point at envio.dev. Chains move upstream, so these
 * targets rot silently. Verify each distinct destination still resolves.
 */
async function checkChainRedirects() {
  const vercelPath = path.join(ROOT, "vercel.json");
  if (!fs.existsSync(vercelPath)) return;

  const redirects = JSON.parse(fs.readFileSync(vercelPath, "utf-8")).redirects || [];
  const targets = [
    ...new Set(
      redirects
        .map((r) => r.destination)
        .filter((d) => typeof d === "string" && d.includes("envio.dev/chains/"))
    ),
  ];

  if (targets.length === 0) return;

  const statuses = await mapLimit(targets, 8, head);
  let broken = 0;
  targets.forEach((url, i) => {
    const status = statuses[i];
    if (status === null) {
      warn(`could not reach ${url}`);
    } else if (status >= 400) {
      broken++;
      const sources = redirects
        .filter((r) => r.destination === url)
        .map((r) => r.source);
      warn(`redirect target ${url} returns ${status}, reached from ${sources.join(", ")}`);
    }
  });

  console.log(
    `[validate-llms] chain redirect targets checked: ${targets.length}, broken: ${broken}`
  );
}

/**
 * Chains added or removed upstream. A chain in the API with no marketing page
 * is a redirect we cannot make, and a chain we redirect to that has left the
 * API is a redirect we should retire.
 */
async function checkChainInventory() {
  let api;
  try {
    const res = await fetch(CHAIN_API, { signal: AbortSignal.timeout(15000) });
    api = await res.json();
  } catch (e) {
    warn(`could not reach the chain API (${CHAIN_API}), skipping inventory check`);
    return;
  }

  // A "-traces" entry is an alternative endpoint for a chain already in the
  // list, sharing its chain id, so it never gets its own marketing page.
  const chains = api.filter((c) => c.name && !c.name.toLowerCase().includes("traces"));

  // envio.dev suffixes a slug with the chain id when the bare slug is already
  // taken (plume -> plume-98866), so a chain counts as covered if either form
  // resolves. Without this the check cries wolf on every suffixed chain.
  const candidates = (c) =>
    [c.name, c.chain_id ? `${c.name}-${c.chain_id}` : null].filter(Boolean);

  const results = await mapLimit(chains, 8, async (c) => {
    for (const slug of candidates(c)) {
      const status = await head(`https://envio.dev/chains/${slug}`);
      if (status === null) return { chain: c, unreachable: true };
      if (status < 400) return { chain: c, covered: true };
    }
    return { chain: c, covered: false };
  });

  const missing = results.filter((r) => r.covered === false).map((r) => r.chain.name);
  for (const n of missing) {
    warn(`chain "${n}" is live in the chain API but has no page on envio.dev/chains`);
  }

  console.log(
    `[validate-llms] chains in API (excluding traces): ${chains.length}, without a marketing page: ${missing.length}`
  );
}

/**
 * llms-full.txt and llms-full-blog.txt must hold exactly the pages llms.txt
 * advertises. A silent gap here is worse than a missing file, because the dump
 * still looks complete to whatever ingests it.
 */
function checkFullTextParity(llms) {
  const sourcesIn = (name) => {
    const p = path.join(BUILD_DIR, name);
    if (!fs.existsSync(p)) return null;
    return new Set(
      [...fs.readFileSync(p, "utf-8").matchAll(/^<!-- source: (\S+) -->$/gm)].map((m) => m[1])
    );
  };

  const linked = [...new Set(linksIn(llms))]
    .filter((u) => u.startsWith(SITE_URL) && u.endsWith(".md"))
    .map((u) => u.replace(/\.md$/, ""));

  const pairs = [
    // V2 is deliberately indexed but kept out of the concatenated dump.
    ["llms-full.txt", linked.filter((u) => u.includes("/docs/") && !u.includes("/docs/v2/"))],
    ["llms-full-blog.txt", linked.filter((u) => u.includes("/blog/"))],
  ];

  for (const [name, expected] of pairs) {
    const actual = sourcesIn(name);
    if (!actual) continue;
    for (const u of expected) {
      if (!actual.has(u)) fail(`${name} is missing ${u}, which llms.txt lists`);
    }
    for (const u of actual) {
      if (!expected.includes(u)) fail(`${name} contains ${u}, which llms.txt does not list`);
    }
  }
}

// ---------------------------------------------------------------------------

async function main() {
  if (!fs.existsSync(BUILD_DIR)) {
    console.error("[validate-llms] no build directory, run a build first");
    process.exit(1);
  }

  checkFilesExist();

  const llmsPath = path.join(BUILD_DIR, "llms.txt");
  if (fs.existsSync(llmsPath)) {
    const llms = fs.readFileSync(llmsPath, "utf-8");
    checkStructure(llms);
    checkInternalLinks(llms);
    checkFullTextParity(llms);
    checkCoverage(llms);
  }
  checkMarkdownCopies();

  if (SKIP_EXTERNAL) {
    console.log("[validate-llms] external checks skipped");
  } else {
    await checkChainRedirects();
    await checkChainInventory();
  }

  for (const w of warnings) console.warn(`[validate-llms] warning: ${w}`);
  for (const e of errors) console.error(`[validate-llms] error: ${e}`);

  if (errors.length > 0) {
    console.error(
      `\n[validate-llms] failed with ${errors.length} error(s) and ${warnings.length} warning(s)`
    );
    process.exit(1);
  }

  console.log(
    `[validate-llms] passed with ${warnings.length} warning(s)`
  );
}

main().catch((e) => {
  console.error("[validate-llms] crashed:", e);
  process.exit(1);
});
