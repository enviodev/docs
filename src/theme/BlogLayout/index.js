import React from 'react';
import clsx from 'clsx';
import Layout from '@theme/Layout';
import BlogSidebar from '@theme/BlogSidebar';

export default function BlogLayout(props) {
  const {sidebar, toc, children, ...layoutProps} = props;
  const hasSidebar = sidebar && sidebar.items.length > 0;

  return (
    <Layout {...layoutProps}>
      <div className="container margin-vert--lg">
        <div className="row">
          <BlogSidebar sidebar={sidebar} />
          <main
            className={clsx('col', {
              // with blog sidebar: 3 (sidebar) + 7 (content) + 2 (toc) = 12
              'col--7': hasSidebar,
              // no sidebar, no toc: centered with offset
              'col--9 col--offset-1': !hasSidebar && !toc,
              // no sidebar, has toc: content (9) + toc (3) = 12
              'col--9': !hasSidebar && toc,
            })}>
            {children}
          </main>
          {toc && (
            <div className={clsx('col', hasSidebar ? 'col--2' : 'col--3')}>
              {toc}
            </div>
          )}
        </div>
      </div>
    </Layout>
  );
}
