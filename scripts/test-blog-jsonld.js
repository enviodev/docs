#!/usr/bin/env node
// Unit tests for plugins/plugin-blog-jsonld.js internal functions.
// Run with: node scripts/test-blog-jsonld.js

const assert = require("assert");
const path = require("path");
const fs = require("fs");
const matter = require("gray-matter");

const {
  resolveBlogUrlPath,
  extractFaqPairs,
  markdownToPlainText,
  buildFaqPageSchema,
  validateFaqPageSchema,
  serializeJsonLd,
  renderJsonLdScripts,
  injectIntoHtml,
} = require("../plugins/plugin-blog-jsonld")._internal;

let passed = 0;
let failed = 0;
function test(name, fn) {
  try {
    fn();
    console.log(`  ok  ${name}`);
    passed++;
  } catch (err) {
    console.log(`FAIL  ${name}`);
    console.log(`      ${err.message}`);
    failed++;
  }
}

console.log("resolveBlogUrlPath");
test("frontmatter slug with leading slash", () => {
  assert.strictEqual(
    resolveBlogUrlPath("2026-03-20-foo.md", { slug: "/my-slug" }),
    "/blog/my-slug"
  );
});
test("frontmatter slug without leading slash", () => {
  assert.strictEqual(
    resolveBlogUrlPath("2026-03-20-foo.md", { slug: "my-slug" }),
    "/blog/my-slug"
  );
});
test("no slug falls back to date-based path", () => {
  assert.strictEqual(
    resolveBlogUrlPath("2025-01-05-some-post.md", {}),
    "/blog/2025/01/05/some-post"
  );
});
test("single-digit day/month are zero-padded", () => {
  assert.strictEqual(
    resolveBlogUrlPath("2025-1-5-some-post.md", {}),
    "/blog/2025/01/05/some-post"
  );
});

console.log("\nmarkdownToPlainText");
test("strips markdown links to anchor text", () => {
  assert.strictEqual(
    markdownToPlainText("See [docs](https://example.com) for details."),
    "See docs for details."
  );
});
test("strips inline code and **bold** (leaves *italic* alone)", () => {
  assert.strictEqual(
    markdownToPlainText("Use **bold** and `code`."),
    "Use bold and code."
  );
});
test("strips HTML tags", () => {
  assert.strictEqual(
    markdownToPlainText("Hello <strong>there</strong>."),
    "Hello there."
  );
});
test("does not mangle underscore-heavy identifiers", () => {
  // Realistic author handle with underscores; should not drop underscores.
  assert.strictEqual(
    markdownToPlainText("Ping @j_o_r_d_y_s on X"),
    "Ping @j_o_r_d_y_s on X"
  );
});

console.log("\nextractFaqPairs");
test("parses canonical FAQ section", () => {
  const content = `
Intro text.

## Frequently Asked Questions

### What is X?
X is a thing that does Y.

### What is Z?
Z is another thing.

It has multiple paragraphs.

## Next section

Not FAQ.
`;
  const pairs = extractFaqPairs(content);
  assert.deepStrictEqual(
    pairs.map((p) => p.question),
    ["What is X?", "What is Z?"]
  );
  assert.strictEqual(pairs[0].answer, "X is a thing that does Y.");
  assert.ok(pairs[1].answer.includes("Z is another thing."));
  assert.ok(pairs[1].answer.includes("multiple paragraphs"));
});
test("accepts 'FAQ' heading variant", () => {
  const content = "## FAQ\n\n### Q1\nA1.\n\n### Q2\nA2.";
  const pairs = extractFaqPairs(content);
  assert.strictEqual(pairs.length, 2);
});
test("returns null when no FAQ section", () => {
  assert.strictEqual(
    extractFaqPairs("Some post.\n\n## Not FAQ\n\n### Q\nA."),
    null
  );
});
test("stops at next H2 (does not leak later ### headings)", () => {
  const content = `## FAQ

### Real Q
Real A.

## Something else

### Not a FAQ question
Not a FAQ answer.`;
  const pairs = extractFaqPairs(content);
  assert.strictEqual(pairs.length, 1);
  assert.strictEqual(pairs[0].question, "Real Q");
});
test("strips markdown links in answers", () => {
  const content = `## FAQ

### Where are the docs?
See the [docs site](https://docs.envio.dev) for details.`;
  const pairs = extractFaqPairs(content);
  assert.strictEqual(
    pairs[0].answer,
    "See the docs site for details."
  );
});

console.log("\nbuildFaqPageSchema");
test("emits Question/Answer entities", () => {
  const s = buildFaqPageSchema([
    { question: "Q1?", answer: "A1." },
    { question: "Q2?", answer: "A2." },
  ]);
  assert.strictEqual(s["@type"], "FAQPage");
  assert.strictEqual(s.mainEntity.length, 2);
  assert.strictEqual(s.mainEntity[0]["@type"], "Question");
  assert.strictEqual(s.mainEntity[0].name, "Q1?");
  assert.strictEqual(s.mainEntity[0].acceptedAnswer.text, "A1.");
});

console.log("\nvalidateFaqPageSchema");
test("accepts a well-formed schema", () => {
  const valid = buildFaqPageSchema([
    { question: "Q1?", answer: "A long-enough answer." },
    { question: "Q2?", answer: "Another long-enough answer." },
  ]);
  assert.deepStrictEqual(validateFaqPageSchema(valid), []);
});
test("rejects missing @context", () => {
  const errs = validateFaqPageSchema({ "@type": "FAQPage", mainEntity: [{}] });
  assert.ok(errs.some((e) => e.includes("@context")));
});
test("rejects wrong @type", () => {
  const errs = validateFaqPageSchema({
    "@context": "https://schema.org",
    "@type": "BlogPosting",
    mainEntity: [],
  });
  assert.ok(errs.some((e) => e.includes("FAQPage")));
});
test("rejects empty mainEntity", () => {
  const errs = validateFaqPageSchema({
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: [],
  });
  assert.ok(errs.some((e) => e.includes("non-empty")));
});
test("rejects question without acceptedAnswer", () => {
  const errs = validateFaqPageSchema({
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: [{ "@type": "Question", name: "Q?" }],
  });
  assert.ok(errs.some((e) => e.includes("acceptedAnswer")));
});
test("rejects empty answer text", () => {
  const errs = validateFaqPageSchema({
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: [
      {
        "@type": "Question",
        name: "Question?",
        acceptedAnswer: { "@type": "Answer", text: "" },
      },
    ],
  });
  assert.ok(errs.some((e) => e.includes("text")));
});
test("rejects duplicate questions", () => {
  const errs = validateFaqPageSchema({
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: [
      {
        "@type": "Question",
        name: "Same?",
        acceptedAnswer: { "@type": "Answer", text: "First answer." },
      },
      {
        "@type": "Question",
        name: "Same?",
        acceptedAnswer: { "@type": "Answer", text: "Second answer." },
      },
    ],
  });
  assert.ok(errs.some((e) => e.includes("duplicate")));
});

console.log("\nserializeJsonLd");
test("escapes </script> substrings defensively", () => {
  const serialized = serializeJsonLd({
    text: "nasty </script> content",
  });
  assert.ok(!serialized.includes("</script>"));
  assert.ok(serialized.includes("<\\/script>"));
});
test("output is valid JSON once unescaped", () => {
  const serialized = serializeJsonLd({
    a: 1,
    b: "hello </script> world",
  });
  const parsed = JSON.parse(serialized.replace(/<\\\//g, "</"));
  assert.strictEqual(parsed.a, 1);
  assert.strictEqual(parsed.b, "hello </script> world");
});

console.log("\nrenderJsonLdScripts / injectIntoHtml");
test("injects before </head> when single schema", () => {
  const block = renderJsonLdScripts([{ "@type": "FAQPage" }]);
  const html = "<html><head><title>T</title></head><body>B</body></html>";
  const out = injectIntoHtml(html, block);
  assert.ok(out.includes('<script type="application/ld+json">'));
  assert.ok(out.includes('"FAQPage"'));
  assert.ok(out.indexOf("</head>") > out.indexOf('"FAQPage"'));
});
test("handles HEAD tag case variations", () => {
  const block = renderJsonLdScripts([{ "@type": "FAQPage" }]);
  const html = "<HTML><HEAD><TITLE>T</TITLE></HEAD><body>B</body></HTML>";
  const out = injectIntoHtml(html, block);
  assert.ok(out.includes('application/ld+json'));
});
test("coexists with Docusaurus's own BlogPosting JSON-LD", () => {
  // Simulate Docusaurus's pre-existing BlogPosting script; our plugin
  // should NOT treat it as 'already injected' and should still add FAQPage.
  const docusaurusHtml = `<html><head><script type="application/ld+json">{"@type":"BlogPosting"}</script></head><body></body></html>`;
  const block = renderJsonLdScripts([{ "@type": "FAQPage" }]);
  const out = injectIntoHtml(docusaurusHtml, block);
  assert.ok(out, "should inject alongside existing BlogPosting");
  assert.ok(out.includes('"BlogPosting"'));
  assert.ok(out.includes('"FAQPage"'));
});
test("is idempotent (no double-injection of FAQPage)", () => {
  const block = renderJsonLdScripts([{ "@type": "FAQPage" }]);
  const html = "<html><head></head><body></body></html>";
  const once = injectIntoHtml(html, block);
  const twice = injectIntoHtml(once, block);
  assert.strictEqual(twice, null);
});
test("returns null if no </head> present", () => {
  const block = renderJsonLdScripts([{ "@type": "FAQPage" }]);
  assert.strictEqual(
    injectIntoHtml("<html><body>no head</body></html>", block),
    null
  );
});

// ----- Integration-style test: parse all real blog posts and sanity-check -----
console.log("\nreal blog posts (integration)");
const blogDir = path.resolve(__dirname, "..", "blog");
const blogFiles = fs
  .readdirSync(blogDir)
  .filter((f) => f.endsWith(".md") || f.endsWith(".mdx"));

test(`all ${blogFiles.length} blog posts have a resolvable slug`, () => {
  const missing = [];
  for (const f of blogFiles) {
    const parsed = matter(fs.readFileSync(path.join(blogDir, f), "utf-8"));
    const url = resolveBlogUrlPath(f, parsed.data || {});
    if (!url) missing.push(f);
  }
  assert.strictEqual(missing.length, 0, `missing: ${missing.join(", ")}`);
});

test("every real FAQ post produces a schema that passes validateFaqPageSchema", () => {
  const failures = [];
  for (const f of blogFiles) {
    const parsed = matter(fs.readFileSync(path.join(blogDir, f), "utf-8"));
    const pairs = extractFaqPairs(parsed.content);
    if (!pairs) continue;
    const errs = validateFaqPageSchema(buildFaqPageSchema(pairs));
    if (errs.length) failures.push(`${f}: ${errs.join("; ")}`);
  }
  assert.strictEqual(failures.length, 0, failures.join("\n"));
});

test("known FAQ posts all parse to >= 3 question pairs", () => {
  const expected = {
    "2026-03-20-best-blockchain-indexers.md": 6,
    "2026-03-25-polymarket-hyperindex-case-study.md": 10,
    "2026-04-14-docs-mcp-server.md": 5,
  };
  for (const [file, expectedCount] of Object.entries(expected)) {
    const raw = fs.readFileSync(path.join(blogDir, file), "utf-8");
    const parsed = matter(raw);
    const pairs = extractFaqPairs(parsed.content);
    assert.ok(pairs, `${file}: no FAQ parsed`);
    assert.strictEqual(
      pairs.length,
      expectedCount,
      `${file}: expected ${expectedCount} pairs, got ${pairs.length}`
    );
    for (const p of pairs) {
      assert.ok(p.question.length > 2, `${file}: empty question`);
      assert.ok(p.answer.length > 10, `${file}: short answer for "${p.question}"`);
    }
  }
});

test("all FAQ-matching posts produce valid schemas with well-formed pairs", () => {
  // We intentionally do not hardcode the full FAQ-post list any more: gold standard
  // technical/evergreen posts include a 5-question FAQ block, and more are added over
  // time. This test just asserts that every post whose content matches the FAQ pattern
  // produces pairs with non-trivial questions and answers.
  const failures = [];
  for (const f of blogFiles) {
    const parsed = matter(fs.readFileSync(path.join(blogDir, f), "utf-8"));
    const pairs = extractFaqPairs(parsed.content);
    if (!pairs) continue;
    for (const p of pairs) {
      if (p.question.length <= 2) failures.push(`${f}: empty question`);
      if (p.answer.length <= 10) failures.push(`${f}: short answer for "${p.question}"`);
    }
  }
  assert.strictEqual(failures.length, 0, failures.join("\n"));
});

console.log(`\n${passed} passed, ${failed} failed`);
process.exit(failed === 0 ? 0 : 1);
