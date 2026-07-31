// Sitemap <lastmod> for blog posts, derived from frontmatter rather than git.
//
// The sitemap plugin's built-in `lastmod` option reads the file's last git
// commit date. That works for docs, but it is a poor signal for the blog:
// any site-wide sweep (a link update, a lint pass) rewrites every post in one
// commit, so all ~80 posts end up claiming the same recent lastmod. Google
// treats a sitemap where everything is always fresh as noise, which is the
// same undifferentiated signal we were trying to fix.
//
// `last_update.date` in frontmatter is the date an author actually revised the
// post, so we use that, falling back to the published date in the filename.

const fs = require("fs");
const path = require("path");
const matter = require("gray-matter");

const blogDir = path.join(__dirname, "../blog");

/** `YYYY-MM-DD-some-post.md` -> `YYYY-MM-DD` */
function publishedDateFromFilename(filename) {
  const match = filename.match(/^(\d{4}-\d{2}-\d{2})/);
  return match ? match[1] : null;
}

function toIsoDate(value) {
  if (!value) return null;
  const date = value instanceof Date ? value : new Date(value);
  return Number.isNaN(date.getTime()) ? null : date.toISOString().slice(0, 10);
}

/**
 * Map of blog permalink (`/blog/<slug>`) -> `YYYY-MM-DD`.
 * @returns {Map<string, string>}
 */
function getBlogLastmodMap() {
  const map = new Map();

  for (const file of fs.readdirSync(blogDir)) {
    if (!file.endsWith(".md") && !file.endsWith(".mdx")) continue;

    const { data } = matter(fs.readFileSync(path.join(blogDir, file), "utf8"));
    if (data.draft || data.unlisted || !data.slug) continue;

    const lastmod =
      toIsoDate(data.last_update?.date) ?? publishedDateFromFilename(file);
    if (!lastmod) continue;

    // slug may or may not carry a leading slash
    const slug = String(data.slug).startsWith("/")
      ? String(data.slug)
      : `/${data.slug}`;
    map.set(`/blog${slug}`, lastmod);
  }

  return map;
}

module.exports = { getBlogLastmodMap };
