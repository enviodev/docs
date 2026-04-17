import React from 'react';
import clsx from 'clsx';
import {useBlogPost} from '@docusaurus/theme-common/internal';
import BlogPostItemHeaderAuthor from '@theme/BlogPostItem/Header/Author';
import styles from './styles.module.css';

export default function BlogPostItemHeaderAuthors({className}) {
  const {metadata: {authors}, assets, isBlogPostPage} = useBlogPost();
  const authorsCount = authors.length;
  if (authorsCount === 0) return null;

  const imageOnly = authors.every(({name}) => !name);

  return (
    <div className={clsx(className)}>
      <div
        className={clsx(
          'margin-top--md margin-bottom--sm',
          imageOnly ? styles.imageOnlyAuthorRow : 'row',
        )}>
        {authors.map((author, idx) => (
          <div
            className={clsx(
              !imageOnly && 'col col--6',
              imageOnly ? styles.imageOnlyAuthorCol : styles.authorCol,
            )}
            key={idx}>
            <BlogPostItemHeaderAuthor
              author={{
                ...author,
                imageURL: assets.authorsImageUrls[idx] ?? author.imageURL,
              }}
            />
          </div>
        ))}
      </div>
    </div>
  );
}
