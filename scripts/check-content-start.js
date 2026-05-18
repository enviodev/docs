#!/usr/bin/env node
// Estimate "content-start-position" per page.
// Simulates naive HTML->text conversion (drop <script>/<style>, take innerText of <body>),
// then locates where main article content begins as a fraction of total text length.

const fs = require('fs');
const path = require('path');
const cheerio = require('cheerio');

const ROOT = path.resolve(__dirname, '..', 'build');

function walk(dir, acc = []) {
  for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
    const p = path.join(dir, entry.name);
    if (entry.isDirectory()) walk(p, acc);
    else if (entry.name === 'index.html') acc.push(p);
  }
  return acc;
}

function analyze(file) {
  const html = fs.readFileSync(file, 'utf8');
  const $ = cheerio.load(html);

  $('script, style, noscript').remove();

  const body = $('body');
  if (!body.length) return null;
  const fullText = body.text().replace(/\s+/g, ' ').trim();
  if (!fullText.length) return null;

  const article = $('article').first();
  if (!article.length) return null;
  const articleText = article.text().replace(/\s+/g, ' ').trim();
  if (!articleText.length) return null;

  const needle = articleText.slice(0, 60);
  const idx = fullText.indexOf(needle);
  if (idx < 0) return null;

  return {
    file,
    total: fullText.length,
    start: idx,
    ratio: idx / fullText.length,
  };
}

const pages = walk(ROOT);
const results = [];
for (const f of pages) {
  try {
    const r = analyze(f);
    if (r) results.push(r);
  } catch (e) {
    console.warn(`Skipped ${path.relative(ROOT, f)}: ${e.message}`);
  }
}

results.sort((a, b) => b.ratio - a.ratio);

const fail = results.filter(r => r.ratio > 0.5);
const warn = results.filter(r => r.ratio >= 0.1 && r.ratio <= 0.5);

console.log(`Analyzed: ${results.length} pages`);
console.log(`Fail (>50%): ${fail.length}`);
console.log(`Warn (10-50%): ${warn.length}`);
console.log();
console.log('Top 25 worst pages:');
for (const r of results.slice(0, 25)) {
  const rel = path.relative(ROOT, r.file);
  console.log(`  ${(r.ratio * 100).toFixed(1).padStart(5)}%  start=${r.start}  total=${r.total}  ${rel}`);
}
