const fs = require('fs');
const path = require('path');
const yaml = require('js-yaml');
const matter = require('gray-matter');

function derivePermalink(filename, slug) {
  if (slug) {
    const s = slug.startsWith('/') ? slug : `/${slug}`;
    return `/blog${s}`;
  }
  const match = filename.match(/^(\d{4})-(\d{2})-(\d{2})-(.+)\.(md|mdx)$/);
  if (match) return `/blog/${match[1]}/${match[2]}/${match[3]}/${match[4]}`;
  return `/blog/${filename.replace(/\.(md|mdx)$/, '')}`;
}

function deriveDateFromFilename(filename) {
  const match = filename.match(/^(\d{4}-\d{2}-\d{2})/);
  return match ? match[1] : '';
}

function normalizeAuthorKeys(rawAuthors) {
  if (!rawAuthors) return [];
  if (typeof rawAuthors === 'string') return [rawAuthors];
  if (Array.isArray(rawAuthors)) {
    return rawAuthors
      .map((a) => (typeof a === 'string' ? a : a?.key))
      .filter(Boolean);
  }
  return [];
}

module.exports = function pluginAuthorPages(context) {
  return {
    name: 'plugin-author-pages',

    async loadContent() {
      const authorsFile = path.join(context.siteDir, 'blog', 'authors.yml');
      const blogDir = path.join(context.siteDir, 'blog');

      if (!fs.existsSync(authorsFile)) return {};

      const authorsRaw = yaml.load(fs.readFileSync(authorsFile, 'utf8'));
      if (!authorsRaw) return {};

      // Normalise image_url → imageUrl for our own usage
      const authors = {};
      for (const [key, data] of Object.entries(authorsRaw)) {
        authors[key] = {
          key,
          ...data,
          imageUrl: data.image_url || data.imageUrl || null,
        };
      }

      // Collect posts per author
      const postsByAuthor = {};
      const files = fs
        .readdirSync(blogDir)
        .filter((f) => f.endsWith('.md') || f.endsWith('.mdx'))
        .sort()
        .reverse();

      for (const file of files) {
        const raw = fs.readFileSync(path.join(blogDir, file), 'utf8');
        const { data } = matter(raw);
        if (data.draft || data.unlisted) continue;

        // support both `authors` and `author` (singular) frontmatter keys
        const keys = normalizeAuthorKeys(data.authors ?? data.author);
        if (keys.length === 0) continue;

        const date = data.date
          ? new Date(data.date).toISOString().slice(0, 10)
          : deriveDateFromFilename(file);

        const permalink = derivePermalink(file, data.slug);
        const tags = Array.isArray(data.tags)
          ? data.tags.map((t) => (typeof t === 'string' ? t : t?.label)).filter(Boolean)
          : [];

        const post = {
          title: data.title || '',
          permalink,
          date,
          image: data.image || null,
          description: data.description || '',
          tags,
        };

        for (const key of keys) {
          if (!postsByAuthor[key]) postsByAuthor[key] = [];
          postsByAuthor[key].push(post);
        }
      }

      // Build result map
      const result = {};
      for (const [key, author] of Object.entries(authors)) {
        result[key] = {
          author,
          posts: postsByAuthor[key] || [],
        };
      }
      return result;
    },

    async contentLoaded({ content, actions }) {
      const { createData, addRoute } = actions;

      for (const [key, data] of Object.entries(content)) {
        const jsonPath = await createData(
          `author-${key}.json`,
          JSON.stringify(data),
        );

        addRoute({
          path: `/blog/author/${key}`,
          component: '@site/src/components/AuthorPage/index.js',
          modules: { authorData: jsonPath },
          exact: true,
        });
      }
    },
  };
};
