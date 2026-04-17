const fs = require('fs');
const path = require('path');
const matter = require('gray-matter');

const blogDir = path.join(__dirname, '../blog');
const outputFile = path.join(__dirname, '../static/blog-posts-index.json');

function derivePermalink(filename, slug) {
  if (slug) {
    // slug may or may not start with '/'
    const s = slug.startsWith('/') ? slug : `/${slug}`;
    return `/blog${s}`;
  }
  // Derive from filename: YYYY-MM-DD-name.md → /blog/YYYY/MM/DD/name
  const match = filename.match(/^(\d{4})-(\d{2})-(\d{2})-(.+)\.(md|mdx)$/);
  if (match) {
    return `/blog/${match[1]}/${match[2]}/${match[3]}/${match[4]}`;
  }
  return `/blog/${filename.replace(/\.(md|mdx)$/, '')}`;
}

function deriveDateFromFilename(filename) {
  const match = filename.match(/^(\d{4}-\d{2}-\d{2})/);
  return match ? match[1] : null;
}

const files = fs
  .readdirSync(blogDir)
  .filter((f) => f.endsWith('.md') || f.endsWith('.mdx'))
  .sort()
  .reverse(); // newest first

const posts = files
  .map((file) => {
    const content = fs.readFileSync(path.join(blogDir, file), 'utf8');
    const {data} = matter(content);

    if (data.draft || data.unlisted) return null;

    const date = data.date
      ? new Date(data.date).toISOString().slice(0, 10)
      : deriveDateFromFilename(file);

    const rawTags = data.tags || [];
    const tags = Array.isArray(rawTags)
      ? rawTags.map((t) => (typeof t === 'string' ? t : t?.label ?? '')).filter(Boolean)
      : [];

    return {
      title: data.title || '',
      permalink: derivePermalink(file, data.slug),
      date: date || '',
      tags,
      image: data.image || null,
      description: data.description || '',
    };
  })
  .filter(Boolean);

fs.writeFileSync(outputFile, JSON.stringify(posts));
console.log(`Generated blog index: ${posts.length} posts → static/blog-posts-index.json`);
