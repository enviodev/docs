import React, { useState } from 'react';
import Layout from '@theme/Layout';
import Link from '@docusaurus/Link';
import clsx from 'clsx';
import styles from './styles.module.css';

const FILTERS = [
  { label: 'All', value: 'all' },
  { label: 'Case Studies', value: 'case-studies' },
  { label: 'Product Updates', value: 'product-updates' },
  { label: 'Announcements', value: 'announcements' },
  { label: 'AI', value: 'ai' },
  { label: 'Tutorials', value: 'tutorials' },
];

const TAG_LABELS = {
  'case-studies': 'Case Studies',
  'product-updates': 'Product Updates',
  'ai': 'AI',
  'announcements': 'Announcements',
  'tutorials': 'Tutorials',
};

function getFirstTagKey(content) {
  const rawTags = content.frontMatter?.tags;
  if (Array.isArray(rawTags) && rawTags.length > 0) {
    const first = rawTags[0];
    return typeof first === 'string' ? first : first?.label;
  }
  const metaTags = content.metadata?.tags;
  if (Array.isArray(metaTags) && metaTags.length > 0) {
    return metaTags[0]?.label;
  }
  return null;
}

function FeaturedCard({ content }) {
  const { metadata, frontMatter } = content;
  const { title, description, permalink } = metadata;
  const image = frontMatter?.image;
  const firstTagKey = getFirstTagKey(content);
  const tagLabel = firstTagKey ? (TAG_LABELS[firstTagKey] ?? firstTagKey) : null;

  return (
    <Link to={permalink} className={clsx(styles.card, styles.featuredCard)}>
      <div className={styles.featuredImage}>
        {image ? (
          <img src={image} alt={title} loading="lazy" />
        ) : (
          <div className={styles.cardImagePlaceholder} />
        )}
      </div>
      <div className={styles.featuredBody}>
        {tagLabel && <span className={styles.categoryTag}>{tagLabel}</span>}
        <h2 className={styles.featuredTitle}>{title}</h2>
        {description && (
          <p className={styles.featuredDescription}>{description}</p>
        )}
      </div>
    </Link>
  );
}

function BlogCard({ content }) {
  const { metadata, frontMatter } = content;
  const { title, description, permalink } = metadata;
  const image = frontMatter?.image;
  const firstTagKey = getFirstTagKey(content);
  const tagLabel = firstTagKey ? (TAG_LABELS[firstTagKey] ?? firstTagKey) : null;

  return (
    <Link to={permalink} className={styles.card}>
      <div className={styles.cardImage}>
        {image ? (
          <img src={image} alt={title} loading="lazy" />
        ) : (
          <div className={styles.cardImagePlaceholder} />
        )}
      </div>
      <div className={styles.cardBody}>
        {tagLabel && <span className={styles.categoryTag}>{tagLabel}</span>}
        <h3 className={styles.cardTitle}>{title}</h3>
        {description && (
          <p className={styles.cardDescription}>{description}</p>
        )}
      </div>
    </Link>
  );
}

export default function BlogListPage({ items }) {
  const [activeFilter, setActiveFilter] = useState('all');

  const allFiltered =
    activeFilter === 'all'
      ? items
      : items.filter(({ content }) => {
          const rawTags = content.frontMatter?.tags;
          if (Array.isArray(rawTags)) {
            return rawTags.some((t) =>
              (typeof t === 'string' ? t : t?.label) === activeFilter
            );
          }
          return content.metadata?.tags?.some(
            (tag) => tag.label === activeFilter
          );
        });

  // Featured post: first post with featured: true in frontmatter, only shown on "All"
  const featuredItem =
    activeFilter === 'all'
      ? allFiltered.find(({ content }) => content.frontMatter?.featured === true)
      : null;

  const regularItems = featuredItem
    ? allFiltered.filter(({ content }) => content !== featuredItem.content)
    : allFiltered;

  return (
    <Layout
      title="Envio Blog"
      description="News, announcements, tutorials, and developer updates from the Envio team."
    >
      <div className={styles.container}>
        <h1 className={styles.pageTitle}>Envio Blog</h1>
        <div className={styles.filters}>
          {FILTERS.map((filter) => (
            <button
              key={filter.value}
              className={clsx(
                styles.filterBtn,
                activeFilter === filter.value && styles.filterBtnActive
              )}
              onClick={() => setActiveFilter(filter.value)}
            >
              {filter.label}
            </button>
          ))}
        </div>

        {allFiltered.length === 0 ? (
          <p className={styles.empty}>No posts found.</p>
        ) : (
          <>
            {featuredItem && (
              <div className={styles.featuredWrapper}>
                <FeaturedCard content={featuredItem.content} />
              </div>
            )}
            <div className={styles.grid}>
              {regularItems.map(({ content }) => (
                <BlogCard key={content.metadata.permalink} content={content} />
              ))}
            </div>
          </>
        )}
      </div>
    </Layout>
  );
}
