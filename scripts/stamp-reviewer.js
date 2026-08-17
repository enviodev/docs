#!/usr/bin/env node
/**
 * CI counterpart to backfill-reviewed-by.js.
 *
 * Run from .github/workflows/stamp-reviewer.yml when a human approves a PR.
 * Stamps `reviewed_by: <approver>` into any blog post touched by the PR that
 * does not already carry the field, so the credit reflects who actually
 * approved the post rather than being chosen by hand.
 *
 * Posts that already have `reviewed_by` are left alone — a later edit must not
 * reassign the original reviewer's credit.
 *
 * Env: GH_TOKEN, REVIEWER (GitHub login), PR (number), GITHUB_REPOSITORY.
 */
const fs = require('fs');
const path = require('path');
const {execFileSync} = require('child_process');

const {REVIEWER, PR, GITHUB_REPOSITORY} = process.env;

if (!REVIEWER || !PR || !GITHUB_REPOSITORY) {
  console.error('missing REVIEWER, PR or GITHUB_REPOSITORY');
  process.exit(1);
}

// REST rather than `gh pr view`: the GraphQL endpoint 503s on this repo.
const changed = JSON.parse(
  execFileSync(
    'gh',
    [
      'api',
      `repos/${GITHUB_REPOSITORY}/pulls/${PR}/files`,
      '--paginate',
      '--jq',
      '[.[] | select(.status != "removed") | .filename]',
    ],
    {encoding: 'utf8', maxBuffer: 1024 * 1024 * 16}
  )
);

const posts = changed.filter((f) => /^blog\/.+\.mdx?$/.test(f));

if (posts.length === 0) {
  console.log('no blog posts in this PR — nothing to stamp');
  process.exit(0);
}

const stamped = [];

for (const rel of posts) {
  const full = path.join(process.cwd(), rel);
  if (!fs.existsSync(full)) {
    continue;
  }
  const src = fs.readFileSync(full, 'utf8');
  if (!src.startsWith('---\n')) {
    console.warn(`${rel}: no frontmatter, skipping`);
    continue;
  }
  const end = src.indexOf('\n---', 4);
  if (end === -1) {
    console.warn(`${rel}: unterminated frontmatter, skipping`);
    continue;
  }
  const fm = src.slice(4, end);
  if (/^reviewed_by:/m.test(fm)) {
    console.log(`${rel}: already credited, leaving as is`);
    continue;
  }
  fs.writeFileSync(full, `---\n${fm}\nreviewed_by: ${REVIEWER}${src.slice(end)}`);
  stamped.push(rel);
}

if (stamped.length === 0) {
  console.log('nothing to stamp');
  process.exit(0);
}

console.log(`stamped ${REVIEWER} into:\n  ${stamped.join('\n  ')}`);

// Surfaced to the workflow so the commit step can be skipped when clean.
fs.appendFileSync(process.env.GITHUB_OUTPUT ?? '/dev/null', 'stamped=true\n');
