import React from 'react';
import Layout from '@theme/Layout';
import Link from '@docusaurus/Link';
import clsx from 'clsx';
import {useHistory} from '@docusaurus/router';
import styles from '../BlogListPage/styles.module.css';

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

export default function BlogTagsPostsPage({ tag, items }) {
  const history = useHistory();

  // Extract active filter value from tag permalink e.g. /blog/tag/case-studies → case-studies
  const activeFilter = tag?.permalink
    ? tag.permalink.replace(/^\/blog\/tag\//, '')
    : 'all';

  const setFilter = (value) => {
    if (value === 'all') {
      history.push('/blog');
    } else {
      history.push(`/blog/tag/${value}`);
    }
  };

  return (
    <Layout
      title={`${tag?.label ?? 'Tagged'} — Envio Blog`}
      description={`Blog posts tagged with ${tag?.label ?? 'this tag'}.`}
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
              onClick={() => setFilter(filter.value)}
            >
              {filter.label}
            </button>
          ))}
        </div>

        {items.length === 0 ? (
          <p className={styles.empty}>No posts found.</p>
        ) : (
          <div className={styles.grid}>
            {items.map(({ content }) => (
              <BlogCard key={content.metadata.permalink} content={content} />
            ))}
          </div>
        )}
      </div>
    </Layout>
  );
}
