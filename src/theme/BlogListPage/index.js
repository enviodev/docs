/**
 * Copyright (c) Facebook, Inc. and its affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */
import React from 'react';
import useDocusaurusContext from '@docusaurus/useDocusaurusContext';
import Layout from '@theme/Layout';
import BlogPostItem from '@theme/BlogPostItem';
import BlogListPaginator from '@theme/BlogListPaginator';
import {ThemeClassNames, HtmlClassNameProvider} from '@docusaurus/theme-common';
import { BlogPostProvider } from "@docusaurus/theme-common/internal";

function BlogListPage(props) {
  const {metadata, items, sidebar} = props;
  // console.log("BlogListPage metadata: ", metadata);


  console.log("BlogListPage props: ", props);
  const {
    siteConfig: {title: siteTitle},
  } = useDocusaurusContext();
  const {blogDescription, blogTitle, permalink} = metadata;
  const isBlogOnlyMode = permalink === '/';
  const title = isBlogOnlyMode ? siteTitle : blogTitle;
  return (
    
    <Layout
      title={title}
      description={blogDescription}
      wrapperClassName={ThemeClassNames.wrapper.blogPages}
      pageClassName={ThemeClassNames.page.blogListPage}
      searchMetadatas={{
        // assign unique search tag to exclude this page from search results!
        tag: 'blog_posts_list',
      }}>
      <main className="container margin-vert--lg">
        <div className="row">
          {items.map(({content: BlogPostContent}) => (
            <aside className="col col--4">
                <HtmlClassNameProvider> 
                  <BlogPostProvider>
                    <BlogPostItem
                      key={BlogPostContent.metadata.permalink}
                      frontMatter={BlogPostContent.frontMatter}
                      metadata={BlogPostContent.metadata}
                      truncated={BlogPostContent.metadata.truncated}>
                      <BlogPostContent />
                    </BlogPostItem>
                  </BlogPostProvider>
                </HtmlClassNameProvider>
            </aside> 
          ))}
        </div>
        <BlogListPaginator metadata={metadata} />
      </main>
    </Layout>
  );
}

export default BlogListPage;