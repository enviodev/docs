/**
 * Copyright (c) Facebook, Inc. and its affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */
import React from "react";
import clsx from "clsx";
import { MDXProvider } from "@mdx-js/react";
import Translate, { translate } from "@docusaurus/Translate";
import Link from "@docusaurus/Link";
import { usePluralForm, PageMetadata } from "@docusaurus/theme-common";
import MDXComponents from "@theme/MDXComponents";
import { useBlogPost } from "@docusaurus/theme-common/internal";
import { BlogPostProvider } from "@docusaurus/theme-common/internal";

import EditThisPage from "@theme/EditThisPage";
import styles from "./styles.module.css"; // Very simple pluralization: probably good enough for now

function useReadingTimePlural() {
  const { selectMessage } = usePluralForm();
  return (readingTimeFloat) => {
    const readingTime = Math.ceil(readingTimeFloat);
    return selectMessage(
      readingTime,
      translate(
        {
          id: "theme.blog.post.readingTime.plurals",
          description:
            'Pluralized label for "{readingTime} min read". Use as much plural forms (separated by "|") as your language support (see https://www.unicode.org/cldr/cldr-aux/charts/34/supplemental/language_plural_rules.html)',
          message: "One min read|{readingTime} min read",
        },
        {
          readingTime,
        }
      )
    );
  };
}

function BlogPostItem(props) {
  console.log("BlogPostItem props: ", props);

  const readingTimePlural = useReadingTimePlural();

  const { metadata } = useBlogPost();
  
  const {
    children,
    frontMatter,
    // metadata,
    truncated,
    isBlogPostPage = false,
  } = props;

  console.log("BlogPostItem metadata: ", metadata);
  const { date, formattedDate, permalink, tags, readingTime, title, editUrl } =
  metadata;
  console.log("BlogPostItem metadata date: ", date);
  const { author, image, keywords } = frontMatter;
  const authorURL = frontMatter.author_url || frontMatter.authorURL;
  const authorTitle = frontMatter.author_title || frontMatter.authorTitle;
  const authorImageURL =
    frontMatter.author_image_url || frontMatter.authorImageURL;

  const renderPostHeader = () => {
    const TitleHeading = isBlogPostPage ? "h1" : "h2";
    return (
      <header style={{ width: "100%", padding: "0px 16px" }}>
        <TitleHeading className={styles.blogPostTitle}>
          {isBlogPostPage ? title : <Link to={permalink}>{title}</Link>}
        </TitleHeading>
        <div className={clsx(styles.blogPostData, "margin-vert--md")}>
          <time dateTime={date}>{formattedDate}</time>

          {readingTime && (
            <>
              {" · "}
              {readingTimePlural(readingTime)}
            </>
          )}
        </div>
        <div className="avatar margin-vert--md">
          {authorImageURL && (
            <Link className="avatar__photo-link avatar__photo" href={authorURL}>
              <img src={authorImageURL} alt={author} />
            </Link>
          )}
          <div className="avatar__intro">
            {author && (
              <>
                <div className="avatar__name">
                  <Link href={authorURL}>{author}</Link>
                </div>
                <small className="avatar__subtitle">{authorTitle}</small>
              </>
            )}
          </div>
        </div>
        {!isBlogPostPage && truncated && (
          <div className="col text--right">
            <Link
              to={metadata.permalink}
              aria-label={`Read more about ${title}`}
            >
              <b>
                <Translate
                  id="theme.blog.post.readMore"
                  description="The label used in blog post item excerpts to link to full blog posts"
                >
                  Read More
                </Translate>
              </b>
            </Link>
          </div>
        )}
      </header>
    );
  };

  return (
    <>

        <PageMetadata
          {...{
            keywords,
            image,
          }}
        />

        <article className={!isBlogPostPage ? "margin-bottom--xl" : undefined}>

          <div className="markdown">
            <MDXProvider components={MDXComponents}>{children}</MDXProvider>
          </div>
          
          {renderPostHeader()}
          {(tags.length > 0 || truncated) && (
            <footer
              className={clsx("row docusaurus-mt-lg", {
                [styles.blogPostDetailsFull]: isBlogPostPage,
              })}
            >
              {tags.length > 0 && (
                <div className="col">
                  <b>
                    <Translate
                      id="theme.tags.tagsListLabel"
                      description="The label alongside a tag list"
                    >
                      Tags:
                    </Translate>
                  </b>
                  {tags.map(({ label, permalink: tagPermalink }) => (
                    <Link
                      key={tagPermalink}
                      className="margin-horiz--sm"
                      to={tagPermalink}
                    >
                      {label}
                    </Link>
                  ))}
                </div>
              )}
              {isBlogPostPage && editUrl && (
                <div className="col margin-top--sm">
                  <EditThisPage editUrl={editUrl} />
                </div>
              )}

            </footer>
          )}
        </article>  
    </>
  );
}

export default BlogPostItem;