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

/**
 * A shallow clone makes every pre-boundary file look like it was added by the
 * graft commit, whose subject belongs to an unrelated PR. Resolving against
 * that credits the wrong person, so refuse to resolve at all when shallow.
 */
function isShallowClone() {
  try {
    return (
      execFileSync("git", ["rev-parse", "--is-shallow-repository"], {
        encoding: "utf8",
        cwd: path.join(__dirname, ".."),
      }).trim() === "true"
    );
  } catch {
    return true;
  }
}

/** Vercel clones shallow by default, so fetch the history we need. */
function tryUnshallow() {
  try {
    execFileSync("git", ["fetch", "--unshallow", "--quiet"], {
      cwd: path.join(__dirname, ".."),
      stdio: "ignore",
      timeout: 120000,
    });
    return !isShallowClone();
  } catch {
    return false;
  }
}

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
  // Paginated: a busy PR can carry more than one page of reviews, and the
  // approval is usually last.
  for (let page = 1; page <= 10; page++) {
    const res = await fetch(
      `https://api.github.com/repos/${REPO}/pulls/${pr}/reviews?per_page=100&page=${page}`,
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
    if (approver) return approver.user.login;
    if (reviews.length < 100) return null;
  }
  return null;
}

/**
 * Confirms the PR we resolved actually touched this post. Guards against a
 * commit subject whose `#N` refers to something unrelated.
 */
async function prTouchedFile(pr, relPath) {
  const res = await fetch(
    `https://api.github.com/repos/${REPO}/pulls/${pr}/files?per_page=100`,
    {
      headers: {
        Accept: "application/vnd.github+json",
        ...(TOKEN ? { Authorization: `Bearer ${TOKEN}` } : {}),
      },
    }
  );
  if (!res.ok) throw new Error(`GitHub responded ${res.status}`);
  const files = await res.json();
  return files.some((f) => f.filename === relPath);
}

module.exports = function pluginBlogReviewers() {
  return {
    name: "plugin-blog-reviewers",

    async loadContent() {
      const resolved = {};
      const unresolved = [];

      // Posts that already carry a value cost nothing, so work out whether
      // there is anything to look up before touching git or the network.
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

      if (isShallowClone() && !tryUnshallow()) {
        console.warn(
          "[blog-reviewers] shallow clone and could not deepen it, skipping " +
            "reviewer resolution rather than risk crediting the wrong person. " +
            `${pending.length} post(s) render without a reviewer.`
        );
        return resolved;
      }

      for (const { file, data } of pending) {

        const subject = addingCommitSubject(path.join("blog", file));
        const prMatch = subject && subject.match(/#(\d+)/g);
        if (!prMatch) continue;

        const pr = prMatch[prMatch.length - 1].slice(1);
        const relPath = `blog/${file}`;
        try {
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
