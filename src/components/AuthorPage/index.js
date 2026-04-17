import React from 'react';
import Layout from '@theme/Layout';
import Link from '@docusaurus/Link';
import clsx from 'clsx';
import styles from './styles.module.css';
import blogStyles from '../../theme/BlogListPage/styles.module.css';

const TAG_LABELS = {
  'case-studies': 'Case Studies',
  'product-updates': 'Product Updates',
  'ai': 'AI',
  'announcements': 'Announcements',
  'tutorials': 'Tutorials',
};

const SOCIAL_LABELS = {
  twitter: 'Twitter / X',
  linkedin: 'LinkedIn',
  github: 'GitHub',
  website: 'Website',
};

function TwitterIcon() {
  return (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
      <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-4.714-6.231-5.401 6.231H2.746l7.73-8.835L1.254 2.25H8.08l4.253 5.622zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
    </svg>
  );
}

function LinkedInIcon() {
  return (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
      <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433a2.062 2.062 0 0 1-2.063-2.065 2.064 2.064 0 1 1 2.063 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" />
    </svg>
  );
}

function GitHubIcon() {
  return (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
      <path d="M12 0C5.374 0 0 5.373 0 12c0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23A11.509 11.509 0 0 1 12 5.803c1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576C20.566 21.797 24 17.3 24 12c0-6.627-5.373-12-12-12z" />
    </svg>
  );
}

function ExternalIcon() {
  return (
    <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true">
      <path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6" />
      <polyline points="15 3 21 3 21 9" />
      <line x1="10" y1="14" x2="21" y2="3" />
    </svg>
  );
}

const SOCIAL_ICONS = {
  twitter: <TwitterIcon />,
  linkedin: <LinkedInIcon />,
  github: <GitHubIcon />,
};

function getInitials(name) {
  return name
    .split(' ')
    .map((w) => w[0])
    .join('')
    .slice(0, 2)
    .toUpperCase();
}

function BlogCard({ post }) {
  const { title, description, permalink, image, tags } = post;
  const firstTag = tags?.[0];
  const tagLabel = firstTag ? (TAG_LABELS[firstTag] ?? firstTag) : null;

  return (
    <Link to={permalink} className={blogStyles.card}>
      <div className={blogStyles.cardImage}>
        {image ? (
          <img src={image} alt={title} loading="lazy" />
        ) : (
          <div className={blogStyles.cardImagePlaceholder} />
        )}
      </div>
      <div className={blogStyles.cardBody}>
        {tagLabel && <span className={blogStyles.categoryTag}>{tagLabel}</span>}
        <h3 className={blogStyles.cardTitle}>{title}</h3>
        {description && (
          <p className={blogStyles.cardDescription}>{description}</p>
        )}
      </div>
    </Link>
  );
}

export default function AuthorPage({ authorData }) {
  const { author, posts } = authorData;
  const {
    name,
    title,
    description,
    imageUrl,
    socials,
  } = author;

  return (
    <Layout
      title={`${name} — Envio Blog`}
      description={description || `Blog posts by ${name}.`}
    >
      <div className={styles.container}>
        {/* Hero */}
        <div className={styles.hero}>
          <div className={styles.avatar}>
            {imageUrl ? (
              <img className={styles.avatarImg} src={imageUrl} alt={name} />
            ) : (
              <span className={styles.avatarInitials}>{getInitials(name)}</span>
            )}
          </div>

          <div className={styles.heroBody}>
            <h1 className={styles.name}>{name}</h1>
            {title && <p className={styles.title}>{title}</p>}
            {description && <p className={styles.description}>{description}</p>}

            {socials && Object.keys(socials).length > 0 && (
              <div className={styles.socials}>
                {Object.entries(socials).map(([platform, url]) => (
                  <a
                    key={platform}
                    href={url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className={styles.socialLink}
                  >
                    {SOCIAL_ICONS[platform] ?? <ExternalIcon />}
                    {SOCIAL_LABELS[platform] ?? platform}
                  </a>
                ))}
              </div>
            )}

            <span className={styles.postCount}>
              {posts.length} {posts.length === 1 ? 'post' : 'posts'}
            </span>
          </div>
        </div>

        {/* Posts */}
        {posts.length === 0 ? (
          <p className={styles.empty}>No posts yet.</p>
        ) : (
          <>
            <p className={styles.postsHeading}>Articles</p>
            <div className={clsx(blogStyles.grid)}>
              {posts.map((post) => (
                <BlogCard key={post.permalink} post={post} />
              ))}
            </div>
          </>
        )}
      </div>
    </Layout>
  );
}
