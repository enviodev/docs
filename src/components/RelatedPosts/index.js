import React, {useState, useEffect} from 'react';
import Link from '@docusaurus/Link';
import {useBlogPost} from '@docusaurus/theme-common/internal';
import styles from './styles.module.css';

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

function PostCard({post}) {
  const tagLabel = post.tags[0] ? (TAG_LABELS[post.tags[0]] ?? post.tags[0]) : null;
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
  const [result, setResult] = useState(null);

  useEffect(() => {
    fetch('/blog-posts-index.json')
      .then((r) => r.json())
      .then((allPosts) => {
        const currentTags = (metadata.tags || []).map((t) =>
          typeof t === 'string' ? t : t.label,
        );
        const others = allPosts.filter(
          (p) => p.permalink !== metadata.permalink,
        );

        const sameTag = others.filter((p) =>
          p.tags.some((t) => currentTags.includes(t)),
        );

        const fromTag = sameTag.length > 0;
        const items = fromTag ? sameTag.slice(0, 3) : others.slice(0, 3);
        setResult({items, fromTag, firstTag: currentTags[0] ?? null});
      })
      .catch(() => {});
  }, [metadata.permalink]);

  if (!result || result.items.length === 0) return null;

  const {items, fromTag, firstTag} = result;
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
