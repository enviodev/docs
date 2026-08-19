// Resolves a blog post's reviewer at build time instead of storing it.
//
// Most posts carry the answer in `reviewed_by` frontmatter already. For any
// post that does not, this looks up the PR that introduced the file and asks
// GitHub who approved it, so a newly merged post is credited on the next build
// with nothing written back to the repo.
//
// Never fails the build. If git history is too shallow, the token is missing,
// or the API is down, the post simply renders without a reviewer line.

const fs = require("fs");
const path = require("path");
const matter = require("gray-matter");
const { execFileSync } = require("child_process");

const blogDir = path.join(__dirname, "../blog");
const REPO = process.env.REVIEWERS_REPO || "enviodev/docs";
const TOKEN = process.env.GITHUB_TOKEN || process.env.GH_TOKEN;
const BOT = /\[bot\]|coderabbitai/i;

/** Subject of the commit that first added `file`, or null. */
function addingCommitSubject(file) {
  try {
    const out = execFileSync(
      "git",
      ["log", "--follow", "--diff-filter=A", "--format=%s", "--", file],
      { encoding: "utf8", cwd: path.join(__dirname, "..") }
    ).trim();
    const lines = out.split("\n").filter(Boolean);
    return lines[lines.length - 1] ?? null;
  } catch {
    return null;
  }
}

/**
 * REST rather than GraphQL: the GraphQL endpoint has been unreliable for this
 * repo, and a build must not hinge on it.
 */
async function approverFor(pr) {
  const res = await fetch(
    `https://api.github.com/repos/${REPO}/pulls/${pr}/reviews?per_page=100`,
    {
      headers: {
        Accept: "application/vnd.github+json",
        ...(TOKEN ? { Authorization: `Bearer ${TOKEN}` } : {}),
      },
    }
  );
  if (!res.ok) throw new Error(`GitHub responded ${res.status}`);
  const reviews = await res.json();
  const approver = reviews.find(
    (r) => r.state === "APPROVED" && !BOT.test(r.user?.login ?? "")
  );
  return approver?.user?.login ?? null;
}

module.exports = function pluginBlogReviewers() {
  return {
    name: "plugin-blog-reviewers",

    async loadContent() {
      const resolved = {};
      const unresolved = [];

      for (const file of fs.readdirSync(blogDir)) {
        if (!file.endsWith(".md") && !file.endsWith(".mdx")) continue;

        const { data } = matter(
          fs.readFileSync(path.join(blogDir, file), "utf8")
        );
        // Frontmatter wins. It is both the backfilled value and the manual
        // override, so a post that has one costs no API call.
        if (data.reviewed_by || !data.slug) continue;

        const subject = addingCommitSubject(path.join("blog", file));
        const prMatch = subject && subject.match(/#(\d+)/g);
        if (!prMatch) continue;

        const pr = prMatch[prMatch.length - 1].slice(1);
        try {
          const handle = await approverFor(pr);
          if (!handle) continue;
          const slug = String(data.slug).startsWith("/")
            ? String(data.slug)
            : `/${data.slug}`;
          resolved[`/blog${slug}`] = handle;
        } catch (err) {
          unresolved.push(`${file} (#${pr}): ${err.message}`);
        }
      }

      if (unresolved.length) {
        console.warn(
          `[blog-reviewers] could not resolve ${unresolved.length} post(s), they render without a reviewer:\n  ` +
            unresolved.join("\n  ")
        );
      }
      const count = Object.keys(resolved).length;
      if (count) console.log(`[blog-reviewers] resolved ${count} post(s) from GitHub`);

      return resolved;
    },

    async contentLoaded({ content, actions }) {
      actions.setGlobalData(content ?? {});
    },
  };
};
