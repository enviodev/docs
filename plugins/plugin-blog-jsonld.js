const fs = require("fs");
const path = require("path");
const matter = require("gray-matter");
const glob = require("glob");

// Docusaurus Plugin: Inject FAQPage JSON-LD into blog post HTML
// --------------------------------------------------------------
// Runs at postBuild. For each blog/*.md file that contains a
// "## Frequently Asked Questions" (or "## FAQ") section composed of
// `### Question` headings followed by paragraph answers, emits an FAQPage
// schema as <script type="application/ld+json"> just before </head>.
//
// Docusaurus 3.x already emits a BlogPosting schema for every blog post,
// so this plugin intentionally does NOT emit BlogPosting (would duplicate).
// We only add the FAQPage signal, which Docusaurus does not handle.
//
// HTML rewriting in postBuild follows the same pattern as
// plugins/plugin-generate-llms.js, so no swizzle is needed.

const FAQ_HEADING_RE = /^##[ \t]+(frequently[ \t]+asked[ \t]+questions|faq)[ \t]*$/im;
const DATE_FROM_FILENAME_RE = /^(\d{4})-(\d{1,2})-(\d{1,2})-(.+)\.mdx?$/;

// Substitute dynamic-count MDX macros before stripping HTML tags, so the
// JSON-LD carries the actual number instead of an empty string.
function substituteDynamicMacros(content, context) {
  const count = context?.hyperSyncChainCount;
  if (!count) return content;
  return content
    .replace(/<HyperSyncChainCount\s*\/>/g, `${count}+`)
    .replace(/<HyperSyncChainCountPlain\s*\/>/g, `${count}`);
}

function resolveBlogUrlPath(filename, frontMatter) {
  if (frontMatter.slug) {
    return `/blog/${String(frontMatter.slug).replace(/^\/+/, "")}`;
  }
  const match = filename.match(DATE_FROM_FILENAME_RE);
  if (match) {
    const [, y, m, d, rest] = match;
    return `/blog/${y}/${m.padStart(2, "0")}/${d.padStart(2, "0")}/${rest}`;
  }
  return null;
}

// Strip basic markdown inline formatting so the answer renders cleanly in
// the FAQPage schema. Google accepts plain text and a narrow subset of HTML;
// plain text is safest and always displays correctly.
function markdownToPlainText(md) {
  if (!md) return "";
  return md
    // Images ![alt](url) → alt (before plain links, since ![ prefixes [)
    .replace(/!\[([^\]]*)\]\([^)]+\)/g, "$1")
    // Links [text](url) → text
    .replace(/\[([^\]]+)\]\([^)]+\)/g, "$1")
    // Inline code `x` → x
    .replace(/`([^`]+)`/g, "$1")
    // Bold **x** → x (skip __ / _ variants: they mangle underscore-heavy
    // identifiers like `@j_o_r_d_y_s` that appear in author lines).
    // Italics `*x*` are left as-is for the same reason: asterisks rarely
    // appear in our prose, but stripping them is risky enough not to bother.
    .replace(/\*\*([^*]+)\*\*/g, "$1")
    // HTML tags (we don't want raw HTML in plain-text answers)
    .replace(/<[^>]+>/g, "")
    // Normalize whitespace
    .replace(/\r\n?/g, "\n")
    .replace(/[ \t]+\n/g, "\n")
    .replace(/\n{3,}/g, "\n\n")
    .trim();
}

// Find the "## Frequently Asked Questions" section and parse its `### Q` /
// answer pairs. Returns an array of {question, answer} or null.
function extractFaqPairs(content) {
  const faqMatch = content.match(FAQ_HEADING_RE);
  if (!faqMatch) return null;

  const faqStart = faqMatch.index + faqMatch[0].length;
  const afterFaq = content.slice(faqStart);
  // End at the next H2 (but not H3+). Use a multiline regex.
  const nextH2Match = afterFaq.match(/^##[ \t]+(?!#)/m);
  const faqBody = nextH2Match
    ? afterFaq.slice(0, nextH2Match.index)
    : afterFaq;

  // Split on lines that start with "### " — the first piece is pre-question
  // content (often blank) and is discarded.
  const sections = faqBody.split(/\n###[ \t]+/);
  const pairs = [];
  for (let i = 1; i < sections.length; i++) {
    const section = sections[i];
    const nlIdx = section.indexOf("\n");
    const question = (nlIdx === -1 ? section : section.slice(0, nlIdx)).trim();
    const rest = nlIdx === -1 ? "" : section.slice(nlIdx + 1);
    const answer = markdownToPlainText(rest);
    if (question && answer) {
      pairs.push({ question, answer });
    }
  }
  return pairs.length ? pairs : null;
}

function buildFaqPageSchema(faqPairs) {
  return {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: faqPairs.map(({ question, answer }) => ({
      "@type": "Question",
      name: question,
      acceptedAnswer: {
        "@type": "Answer",
        text: answer,
      },
    })),
  };
}

// Validate a FAQPage schema against Google's required structure.
// Returns an array of error strings (empty = valid). The plugin uses this
// to fail the build on malformed output rather than shipping silently
// broken JSON-LD.
function validateFaqPageSchema(schema) {
  const errors = [];
  if (!schema || typeof schema !== "object") {
    errors.push("schema is not an object");
    return errors;
  }
  if (!String(schema["@context"] || "").includes("schema.org")) {
    errors.push(`@context must reference schema.org, got ${JSON.stringify(schema["@context"])}`);
  }
  if (schema["@type"] !== "FAQPage") {
    errors.push(`@type must be "FAQPage", got ${JSON.stringify(schema["@type"])}`);
  }
  const entities = schema.mainEntity;
  if (!Array.isArray(entities) || entities.length === 0) {
    errors.push("mainEntity must be a non-empty array");
    return errors;
  }
  const seen = new Set();
  entities.forEach((q, i) => {
    const prefix = `mainEntity[${i}]`;
    if (!q || typeof q !== "object") {
      errors.push(`${prefix} is not an object`);
      return;
    }
    if (q["@type"] !== "Question") {
      errors.push(`${prefix}.@type must be "Question", got ${JSON.stringify(q["@type"])}`);
    }
    if (typeof q.name !== "string" || q.name.length < 3) {
      errors.push(`${prefix}.name must be a non-trivial string`);
    } else if (seen.has(q.name)) {
      errors.push(`${prefix}.name duplicates an earlier question: ${JSON.stringify(q.name)}`);
    } else {
      seen.add(q.name);
    }
    const a = q.acceptedAnswer;
    if (!a || typeof a !== "object") {
      errors.push(`${prefix}.acceptedAnswer is missing or not an object`);
    } else {
      if (a["@type"] !== "Answer") {
        errors.push(`${prefix}.acceptedAnswer.@type must be "Answer", got ${JSON.stringify(a["@type"])}`);
      }
      if (typeof a.text !== "string" || a.text.length < 5) {
        errors.push(`${prefix}.acceptedAnswer.text must be a non-trivial string`);
      }
    }
  });
  return errors;
}

// Serialize JSON-LD for embedding inside a <script> tag. Escaping `</` is
// standard practice to prevent the HTML parser from terminating the script
// early if any string happens to contain "</script>" (unlikely here but
// cheap insurance, and Google's own examples do it).
function serializeJsonLd(schema) {
  return JSON.stringify(schema, null, 2).replace(/<\/(script)/gi, "<\\/$1");
}

function renderJsonLdScripts(schemas) {
  return schemas
    .map(
      (schema) =>
        `<script type="application/ld+json">\n${serializeJsonLd(schema)}\n</script>`
    )
    .join("\n");
}

function injectIntoHtml(html, scriptsBlock) {
  // Idempotent: bail if an FAQPage script is already present.
  // (Docusaurus emits its own BlogPosting script on every post — we rely on
  // FAQPage as the "did our plugin already run?" marker.)
  if (html.includes('"FAQPage"')) {
    return null;
  }
  const headCloseIdx = html.search(/<\/head\s*>/i);
  if (headCloseIdx === -1) return null;
  return (
    html.slice(0, headCloseIdx) +
    scriptsBlock +
    "\n" +
    html.slice(headCloseIdx)
  );
}

function BlogJsonLdPlugin(context, options = {}) {
  const blogDir = path.resolve(context.siteDir, options.blogDir || "blog");
  // Resolve the current HyperSync chain count so <HyperSyncChainCount />
  // macros in FAQ answers get substituted with the real number in JSON-LD.
  let dynamicMacroContext = {};
  try {
    const countPath = path.resolve(context.siteDir, "src/data/network-count.json");
    if (fs.existsSync(countPath)) {
      dynamicMacroContext = JSON.parse(fs.readFileSync(countPath, "utf-8"));
    }
  } catch (e) {
    console.warn("[plugin-blog-jsonld] could not load network-count.json:", e.message);
  }

  return {
    name: "docusaurus-plugin-blog-jsonld",

    async postBuild({ outDir }) {
      if (!fs.existsSync(blogDir)) {
        console.warn(
          `[plugin-blog-jsonld] blog directory not found: ${blogDir}`
        );
        return;
      }

      const files = glob.sync("*.{md,mdx}", { cwd: blogDir });

      let injected = 0;
      let noFaq = 0;
      const missing = [];

      for (const file of files) {
        const fullPath = path.join(blogDir, file);
        const raw = fs.readFileSync(fullPath, "utf-8");
        const parsed = matter(raw);
        const fm = parsed.data || {};

        if (fm.jsonld === false) continue;

        const preprocessed = substituteDynamicMacros(parsed.content, dynamicMacroContext);
        const faqPairs = extractFaqPairs(preprocessed);
        if (!faqPairs) {
          noFaq++;
          continue;
        }

        const urlPath = resolveBlogUrlPath(file, fm);
        if (!urlPath) continue;
        const htmlPath = path.join(outDir, urlPath, "index.html");

        if (!fs.existsSync(htmlPath)) {
          missing.push({ file, htmlPath });
          continue;
        }

        const schema = buildFaqPageSchema(faqPairs);

        // Defense-in-depth: validate the schema BEFORE writing it. Any
        // failure here throws and fails the build (and therefore the
        // Vercel deploy), turning silent correctness bugs into loud
        // notifications. Cheap insurance — runs in microseconds.
        const validationErrors = validateFaqPageSchema(schema);
        if (validationErrors.length) {
          throw new Error(
            `[plugin-blog-jsonld] invalid FAQPage schema for ${file}:\n  - ` +
              validationErrors.join("\n  - ")
          );
        }
        const serialized = serializeJsonLd(schema);
        // And re-parse it to confirm the embedded form is valid JSON
        // (the </script> escape doesn't break round-tripping).
        try {
          JSON.parse(serialized.replace(/<\\\//g, "</"));
        } catch (e) {
          throw new Error(
            `[plugin-blog-jsonld] serialized JSON-LD for ${file} is not valid JSON: ${e.message}`
          );
        }

        const scriptsBlock = `<script type="application/ld+json">\n${serialized}\n</script>`;
        const html = fs.readFileSync(htmlPath, "utf-8");
        const newHtml = injectIntoHtml(html, scriptsBlock);
        if (!newHtml) continue;

        fs.writeFileSync(htmlPath, newHtml, "utf-8");
        injected++;
      }

      if (missing.length) {
        console.warn(
          `[plugin-blog-jsonld] ${missing.length} post(s) had no matching built HTML:`
        );
        for (const { file, htmlPath } of missing.slice(0, 5)) {
          console.warn(`  - ${file} → ${htmlPath}`);
        }
        if (missing.length > 5) {
          console.warn(`  ... and ${missing.length - 5} more`);
        }
      }

      console.log(
        `[plugin-blog-jsonld] injected FAQPage into ${injected} post(s); ` +
          `${noFaq} post(s) had no FAQ section.`
      );
    },
  };
}

module.exports = BlogJsonLdPlugin;
module.exports.default = BlogJsonLdPlugin;
// Exported for the standalone test script.
module.exports._internal = {
  resolveBlogUrlPath,
  extractFaqPairs,
  markdownToPlainText,
  buildFaqPageSchema,
  validateFaqPageSchema,
  serializeJsonLd,
  renderJsonLdScripts,
  injectIntoHtml,
};
