#!/usr/bin/env node
/**
 * One-off backfill for the `reviewed_by` blog frontmatter field.
 *
 * For each post it finds the commit that introduced the file, reads the PR
 * number from that commit's subject (squash merges leave `(#1234)` there), and
 * takes the non-bot APPROVED review from that PR.
 *
 * Note: `gh api repos/OWNER/REPO/commits/SHA/pulls` does NOT work here — for a
 * squash merge the commit on main is not part of the PR, so it returns []. The
 * commit subject is the reliable link. A full (non-shallow) clone is required,
 * otherwise every pre-boundary file looks like it was added by the oldest
 * commit available.
 *
 * Usage: node scripts/backfill-reviewed-by.js [--dry-run]
 */
const fs = require('fs');
const path = require('path');
const {execFileSync} = require('child_process');

const BLOG_DIR = path.join(__dirname, '..', 'blog');
const DRY_RUN = process.argv.includes('--dry-run');
const BOT = /\[bot\]|coderabbitai/i;

const sh = (cmd, args) =>
  execFileSync(cmd, args, {encoding: 'utf8', maxBuffer: 1024 * 1024 * 16}).trim();

// The GitHub API returns transient 503s often enough to break a one-shot run.
function shWithRetry(cmd, args, attempts = 4) {
  for (let i = 1; ; i++) {
    try {
      return sh(cmd, args);
    } catch (err) {
      if (i >= attempts) {
        throw err;
      }
      const waitMs = 2000 * i;
      console.warn(`  ${cmd} failed (attempt ${i}/${attempts}), retrying in ${waitMs}ms`);
      execFileSync('sleep', [String(waitMs / 1000)]);
    }
  }
}

function addingCommitSubject(file) {
  const log = sh('git', [
    'log',
    '--follow',
    '--diff-filter=A',
    '--format=%s',
    '--',
    file,
  ]);
  const lines = log.split('\n').filter(Boolean);
  return lines[lines.length - 1] ?? '';
}

const REPO = 'enviodev/docs';

// Deliberately REST, not `gh pr view` / `gh pr list`: those go through GitHub's
// GraphQL endpoint, which returns 503 for a bulk reviews query on this repo.
// Results are cached per PR so a post-per-PR repeat costs nothing.
const reviewCache = new Map();

function reviewsFor(pr) {
  const key = Number(pr);
  if (!reviewCache.has(key)) {
    const raw = shWithRetry('gh', [
      'api',
      `repos/${REPO}/pulls/${key}/reviews`,
      '--paginate',
    ]);
    reviewCache.set(key, JSON.parse(raw));
  }
  return reviewCache.get(key);
}

function approverFor(pr) {
  let reviews;
  try {
    reviews = reviewsFor(pr);
  } catch {
    // Distinct from "no approver" — a lookup failure must not silently strip a
    // credit, so it is reported as unresolved instead.
    throw new Error(`could not fetch reviews for PR #${pr}`);
  }
  const approvers = [
    ...new Set(
      reviews
        .filter((r) => r.state === 'APPROVED' && !BOT.test(r.user.login))
        .map((r) => r.user.login)
    ),
  ];
  // Multiple approvers is rare; the first approval is the one that unblocked
  // the merge, so it is the credit we want.
  return approvers[0] ?? null;
}

function stamp(fullPath, handle) {
  const src = fs.readFileSync(fullPath, 'utf8');
  if (!src.startsWith('---\n')) {
    return 'no-frontmatter';
  }
  const end = src.indexOf('\n---', 4);
  if (end === -1) {
    return 'no-frontmatter';
  }
  const fm = src.slice(4, end);
  if (/^reviewed_by:/m.test(fm)) {
    return 'already-set';
  }
  const updated = `---\n${fm}\nreviewed_by: ${handle}${src.slice(end)}`;
  if (!DRY_RUN) {
    fs.writeFileSync(fullPath, updated);
  }
  return 'stamped';
}

const results = {stamped: [], skipped: [], unresolved: []};

for (const name of fs.readdirSync(BLOG_DIR).filter((f) => /\.mdx?$/.test(f)).sort()) {
  const rel = path.join('blog', name);
  const subject = addingCommitSubject(rel);
  const match = subject.match(/#(\d+)/g);
  if (!match) {
    results.unresolved.push(`${name} — no PR number in "${subject}"`);
    continue;
  }
  const pr = match[match.length - 1].slice(1);
  let handle;
  try {
    handle = approverFor(pr);
  } catch (err) {
    results.unresolved.push(`${name} — ${err.message}`);
    continue;
  }
  if (!handle) {
    results.unresolved.push(`${name} — PR #${pr} has no human approval`);
    continue;
  }
  const outcome = stamp(path.join(BLOG_DIR, name), handle);
  if (outcome === 'stamped') {
    results.stamped.push(`${name} → ${handle} (#${pr})`);
  } else {
    results.skipped.push(`${name} — ${outcome}`);
  }
}

console.log(`stamped:    ${results.stamped.length}`);
console.log(`skipped:    ${results.skipped.length}`);
console.log(`unresolved: ${results.unresolved.length}`);
if (results.unresolved.length) {
  console.log('\nunresolved (left without a reviewer credit):');
  results.unresolved.forEach((l) => console.log(`  ${l}`));
}
if (DRY_RUN) {
  console.log('\n--dry-run: no files written');
}
