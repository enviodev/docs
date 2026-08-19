// Resolves a blog post's reviewer at build time instead of storing it.
//
// Most posts carry the answer in `reviewed_by` frontmatter already. For any
// post that does not, this asks GitHub which PR introduced the file and who
// approved it, so a newly merged post is credited on the next build with
// nothing written back to the repo.
//
// Everything goes through the GitHub API rather than local git on purpose.
// Vercel builds from a shallow clone, and reading history there resolves the
// graft commit instead of the real one, which credits the wrong person.
//
// Never fails the build. Without a token, or if the API is unreachable, the
// post simply renders without a reviewer line.

const fs = require("fs");
const path = require("path");
const matter = require("gray-matter");

const blogDir = path.join(__dirname, "../blog");
const REPO = process.env.REVIEWERS_REPO || "enviodev/docs";
const TOKEN = process.env.GITHUB_TOKEN || process.env.GH_TOKEN;
const BOT = /\[bot\]|coderabbitai/i;

async function gh(endpoint) {
  const res = await fetch(`https://api.github.com/repos/${REPO}/${endpoint}`, {
    headers: {
      Accept: "application/vnd.github+json",
      ...(TOKEN ? { Authorization: `Bearer ${TOKEN}` } : {}),
    },
  });
  if (!res.ok) throw new Error(`GitHub responded ${res.status} for ${endpoint}`);
  return res.json();
}

/** Subject line of the oldest commit touching `relPath`, or null. */
async function addingCommitSubject(relPath) {
  let oldest = null;
  for (let page = 1; page <= 10; page++) {
    const commits = await gh(
      `commits?path=${encodeURIComponent(relPath)}&per_page=100&page=${page}`
    );
    if (commits.length === 0) break;
    oldest = commits[commits.length - 1];
    if (commits.length < 100) break;
  }
  return oldest?.commit?.message?.split("\n")[0] ?? null;
}

/** Confirms the PR actually touched this post, so an unrelated `#N` cannot match. */
async function prTouchedFile(pr, relPath) {
  for (let page = 1; page <= 10; page++) {
    const files = await gh(`pulls/${pr}/files?per_page=100&page=${page}`);
    if (files.some((f) => f.filename === relPath)) return true;
    if (files.length < 100) return false;
  }
  return false;
}

/** First non-bot approval on the PR, or null. */
async function approverFor(pr) {
  for (let page = 1; page <= 10; page++) {
    const reviews = await gh(`pulls/${pr}/reviews?per_page=100&page=${page}`);
    const approver = reviews.find(
      (r) => r.state === "APPROVED" && !BOT.test(r.user?.login ?? "")
    );
    if (approver) return approver.user.login;
    if (reviews.length < 100) return null;
  }
  return null;
}

module.exports = function pluginBlogReviewers() {
  return {
    name: "plugin-blog-reviewers",

    async loadContent() {
      const resolved = {};
      const unresolved = [];

      // Posts that already carry a value cost nothing, so work out whether
      // there is anything to look up before touching the network.
      const pending = [];
      for (const file of fs.readdirSync(blogDir)) {
        if (!file.endsWith(".md") && !file.endsWith(".mdx")) continue;
        const { data } = matter(
          fs.readFileSync(path.join(blogDir, file), "utf8")
        );
        // Frontmatter wins. It is both the backfilled value and the manual
        // override.
        if (data.reviewed_by || !data.slug) continue;
        pending.push({ file, data });
      }

      if (pending.length === 0) return resolved;

      for (const { file, data } of pending) {
        const relPath = `blog/${file}`;
        try {
          const subject = await addingCommitSubject(relPath);
          const prMatch = subject && subject.match(/#(\d+)/g);
          if (!prMatch) continue;

          const pr = prMatch[prMatch.length - 1].slice(1);
          if (!(await prTouchedFile(pr, relPath))) {
            unresolved.push(`${file}: PR #${pr} did not touch this file`);
            continue;
          }
          const handle = await approverFor(pr);
          if (!handle) continue;

          const slug = String(data.slug).startsWith("/")
            ? String(data.slug)
            : `/${data.slug}`;
          resolved[`/blog${slug}`] = handle;
        } catch (err) {
          unresolved.push(`${file}: ${err.message}`);
        }
      }

      if (unresolved.length) {
        console.warn(
          `[blog-reviewers] could not resolve ${unresolved.length} post(s), they render without a reviewer:\n  ` +
            unresolved.join("\n  ")
        );
      }
      const count = Object.keys(resolved).length;
      if (count)
        console.log(`[blog-reviewers] resolved ${count} post(s) from GitHub`);

      return resolved;
    },

    async contentLoaded({ content, actions }) {
      actions.setGlobalData(content ?? {});
    },
  };
};
