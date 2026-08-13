import React from 'react';
import Link from '@docusaurus/Link';
import {useBlogPost} from '@docusaurus/theme-common/internal';
// Imported at build time rather than fetched at runtime. This block used to
// `fetch('/blog-posts-index.json')` inside a `useEffect`, which meant the
// component rendered `null` during static generation and the related links
// existed only after hydration — so every blog post shipped HTML whose only
// internal links were the sidebar (identical on all 74 posts, and discounted
// as boilerplate). A crawl of docs.envio.dev found the older posts had no
// in-content inbound links at all beyond /blog and an author archive, which is
// the profile Search Console reports as "Discovered - currently not indexed".
// Importing the index inlines it into the blog bundle instead, so the links are
// server-rendered — and it drops a network request per post view.
import allPosts from '@site/static/blog-posts-index.json';
import styles from './styles.module.css';

const RELATED_COUNT = 3;

const TAG_LABELS = {
  'case-studies': 'Case Studies',
  'product-updates': 'Product Updates',
  ai: 'AI',
  announcements: 'Announcements',
  tutorials: 'Tutorials',
};

const TAG_HEADING = {
  'case-studies': 'More Case Studies',
  'product-updates': 'More Product Updates',
  announcements: 'More Announcements',
  tutorials: 'More Tutorials',
};

// Walk forward from this post's own position and wrap around, rather than
// always taking the head of the list. Slicing the first N gave every post in a
// tag the same N targets, so the newest few posts in each group absorbed all
// the inbound links and the older ones — exactly the posts Google was refusing
// to crawl — received none. Rotating means each post in a group of n receives
// RELATED_COUNT inbound links, spread evenly, and the mapping stays
// deterministic so a rebuild does not reshuffle the graph.
function rotate(pool, permalink, count, exclude) {
  const start = pool.findIndex((p) => p.permalink === permalink);
  const base = start === -1 ? 0 : start;
  const picked = [];
  for (let i = 1; i < pool.length && picked.length < count; i++) {
    const candidate = pool[(base + i) % pool.length];
    if (candidate.permalink !== permalink && !exclude.has(candidate.permalink)) {
      picked.push(candidate);
    }
  }
  return picked;
}

function pickRelated(permalink, currentTags) {
  // One slot is always spent on the post's neighbour in the full list. Rotating
  // over every post is a single cycle, so that slot alone guarantees each post
  // receives exactly one inbound link — 31 of the 74 posts carry no tags at
  // all, and a purely tag-based pick left six of them (including
  // /blog/best-blockchain-indexers-2026 and /blog/what-is-hypersync, both
  // high-intent pages) with no in-content inbound link whatsoever.
  const neighbour = rotate(allPosts, permalink, 1, new Set());
  const claimed = new Set(neighbour.map((p) => p.permalink));

  const tagged =
    currentTags.length > 0
      ? allPosts.filter((p) => (p.tags ?? []).some((t) => currentTags.includes(t)))
      : [];
  // Take what the tag can offer, then backfill from the full list. A small tag
  // cannot fill the row on its own: `announcements` holds three posts, so once
  // the current post and the post already claimed as the neighbour are
  // excluded it yields a single card, and
  // /blog/metamask-smart-accounts-hackathon-winners rendered a two-card row.
  // Backfilling keeps every post at RELATED_COUNT while still preferring
  // same-tag matches, and a tag with a single member still degrades cleanly.
  const remaining = RELATED_COUNT - neighbour.length;
  const related =
    tagged.length > 1 ? rotate(tagged, permalink, remaining, claimed) : [];
  related.forEach((post) => claimed.add(post.permalink));
  const fill = rotate(allPosts, permalink, remaining - related.length, claimed);

  return {
    items: [...related, ...fill, ...neighbour].slice(0, RELATED_COUNT),
    fromTag: related.length > 0,
  };
}

function PostCard({post}) {
  const tagLabel = post.tags?.[0]
    ? (TAG_LABELS[post.tags[0]] ?? post.tags[0])
    : null;
  return (
    <Link to={post.permalink} className={styles.card}>
      <div className={styles.cardImage}>
        {post.image ? (
          <img src={post.image} alt={post.title} loading="lazy" />
        ) : (
          <div className={styles.cardImagePlaceholder} />
        )}
      </div>
      <div className={styles.cardBody}>
        {tagLabel && <span className={styles.tag}>{tagLabel}</span>}
        <h3 className={styles.cardTitle}>{post.title}</h3>
        {post.description && (
          <p className={styles.cardDesc}>{post.description}</p>
        )}
      </div>
    </Link>
  );
}

export default function RelatedPosts() {
  const {metadata} = useBlogPost();

  const currentTags = (metadata.tags ?? []).map((t) =>
    typeof t === 'string' ? t : t.label,
  );
  const {items, fromTag} = pickRelated(metadata.permalink, currentTags);

  if (items.length === 0) return null;

  const firstTag = currentTags[0] ?? null;
  const heading =
    fromTag && firstTag && TAG_HEADING[firstTag]
      ? TAG_HEADING[firstTag]
      : 'More Posts';

  return (
    <div className={styles.wrapper}>
      <h3 className={styles.heading}>{heading}</h3>
      <div className={styles.grid}>
        {items.map((post) => (
          <PostCard key={post.permalink} post={post} />
        ))}
      </div>
    </div>
  );
}
