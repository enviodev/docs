import React from 'react';
import Link from '@docusaurus/Link';
import {useBlogPost} from '@docusaurus/theme-common/internal';
import {useDateTimeFormat} from '@docusaurus/theme-common/internal';
import BlogPostItemHeaderTitle from '@theme/BlogPostItem/Header/Title';
import BlogPostItemHeaderInfo from '@theme/BlogPostItem/Header/Info';
import BlogPostItemHeaderAuthors from '@theme/BlogPostItem/Header/Authors';
import styles from './styles.module.css';
import tagStyles from '../../BlogListPage/styles.module.css';

const TAG_LABELS = {
  'case-studies': 'Case Studies',
  'product-updates': 'Product Updates',
  'ai': 'AI',
  'announcements': 'Announcements',
  'tutorials': 'Tutorials',
};

function AuthorMetaLine({authors, assets, date, readingTime}) {
  const dateTimeFormat = useDateTimeFormat({
    day: 'numeric',
    month: 'long',
    year: 'numeric',
    timeZone: 'UTC',
  });
  const formattedDate = dateTimeFormat.format(new Date(date));
  const readingMins = readingTime !== undefined ? Math.ceil(readingTime) : null;

  const namedAuthors = authors.filter(({name}) => name);
  const label = namedAuthors.length > 1 ? 'Authors' : 'Author';

  return (
    <div className={styles.metaLine}>
      {namedAuthors.length > 0 && (
        <>
          <span className={styles.metaLabel}>{label}:</span>
          {namedAuthors.map((author, idx) => {
            const imageURL = assets?.authorsImageUrls?.[idx] ?? author.imageURL;
            return (
              <React.Fragment key={idx}>
                {idx > 0 && <span className={styles.metaSep}>,</span>}
                {author.url ? (
                  <Link to={author.url} className={styles.authorLink}>
                    {imageURL && (
                      <img
                        src={imageURL}
                        alt={author.name}
                        className={styles.authorAvatar}
                      />
                    )}
                    {author.name}
                  </Link>
                ) : (
                  <span className={styles.authorName}>{author.name}</span>
                )}
              </React.Fragment>
            );
          })}
          <span className={styles.metaDot}>·</span>
        </>
      )}
      <time dateTime={date} className={styles.metaDate}>{formattedDate}</time>
      {readingMins !== null && (
        <>
          <span className={styles.metaDot}>·</span>
          <span className={styles.metaRead}>{readingMins} min read</span>
        </>
      )}
    </div>
  );
}

export default function BlogPostItemHeader() {
  const {metadata, assets, isBlogPostPage} = useBlogPost();
  const {tags, authors, date, readingTime} = metadata;

  const firstTag = tags?.[0];
  const tagLabel = firstTag
    ? (TAG_LABELS[firstTag.label] ?? firstTag.label)
    : null;

  return (
    <header>
      {isBlogPostPage && tagLabel && firstTag?.permalink && (
        <Link to={firstTag.permalink} className={tagStyles.categoryTag}>
          {tagLabel}
        </Link>
      )}
      <BlogPostItemHeaderTitle />
      {isBlogPostPage ? (
        <AuthorMetaLine
          authors={authors}
          assets={assets}
          date={date}
          readingTime={readingTime}
        />
      ) : (
        <>
          <BlogPostItemHeaderInfo />
          <BlogPostItemHeaderAuthors />
        </>
      )}
    </header>
  );
}
