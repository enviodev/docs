import React from 'react';
import Layout from '@theme/Layout';
import Head from '@docusaurus/Head';
import Link from '@docusaurus/Link';
import clsx from 'clsx';
import {useHistory, useLocation} from '@docusaurus/router';
import useDocusaurusContext from '@docusaurus/useDocusaurusContext';
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

export const TAG_META = {
  all: {
    pageTitle: 'Envio Blog',
    htmlTitle: 'Envio Blog',
    description:
      "Technical articles, case studies, tutorials, product updates, and agentic indexing insights from Envio's blockchain data infrastructure team.",
    image: '/blog-assets/og/blog.png',
  },
  'case-studies': {
    pageTitle: 'Envio Case Studies',
    htmlTitle: 'Envio Case Studies',
    description:
      'See how industry-leading Web3 teams scale onchain data with Envio in minutes. Learn how to do the same or build production-ready indexers for your project.',
    image: '/blog-assets/og/case-studies.png',
  },
  'product-updates': {
    pageTitle: 'Envio Product Updates',
    htmlTitle: 'Envio Product Updates',
    description:
      'Monthly product updates and change logs across Envio. New releases, features, supported networks, agentic indexing workflows and more.',
    image: '/blog-assets/og/product-updates.png',
  },
  announcements: {
    pageTitle: 'Envio Announcements',
    htmlTitle: 'Envio Announcements',
    description:
      'Official Envio updates: product launches, partnerships, new network support, and integrations across HyperIndex, HyperSync, and HyperRPC.',
    image: '/blog-assets/og/announcements.png',
  },
  ai: {
    pageTitle: 'Envio AI',
    htmlTitle: 'Envio AI',
    description:
      'Build agentic blockchain indexing, MCP servers, and AI-native data workflows using Envio. Real-time onchain data for LLMs and AI agents.',
    image: '/blog-assets/og/ai.png',
  },
  tutorials: {
    pageTitle: 'Envio Tutorials',
    htmlTitle: 'Envio Tutorials',
    description:
      'Hands-on developer tutorials covering subgraph migrations, querying onchain data at scale, building production-ready indexers and much more using Envio.',
    image: '/blog-assets/og/tutorials.png',
  },
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
  const history = useHistory();
  const location = useLocation();
  const {siteConfig} = useDocusaurusContext();
  const params = new URLSearchParams(location.search);
  const activeFilter = params.get('tag') || 'all';
  const meta = TAG_META[activeFilter] ?? TAG_META.all;
  const absoluteImage = `${siteConfig.url}${meta.image}`;

  const setFilter = (value) => {
    if (value === 'all') {
      history.push('/blog');
    } else {
      history.push(`/blog/tag/${value}`);
    }
  };

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

  const featuredItem =
    activeFilter === 'all'
      ? allFiltered.find(({ content }) => content.frontMatter?.featured === true)
      : null;

  const regularItems = featuredItem
    ? allFiltered.filter(({ content }) => content !== featuredItem.content)
    : allFiltered;

  return (
    <Layout
      title={meta.htmlTitle}
      description={meta.description}
    >
      <Head>
        <meta property="og:image" content={absoluteImage} />
        <meta property="og:image:width" content="1200" />
        <meta property="og:image:height" content="630" />
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:image" content={absoluteImage} />
      </Head>
      <div className={styles.container}>
        <h1 className={styles.pageTitle}>{meta.pageTitle}</h1>
        <p className={styles.pageSubtitle}>{meta.description}</p>
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
