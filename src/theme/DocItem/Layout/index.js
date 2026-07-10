import React from 'react';
import Layout from '@theme-original/DocItem/Layout';
import {useActivePlugin} from '@docusaurus/plugin-content-docs/client';
import Head from '@docusaurus/Head';

export default function LayoutWrapper(props) {
  const activePlugin = useActivePlugin();
  const pluginId = activePlugin?.pluginId;

  // The version banner itself lives in src/theme/DocVersionBanner — it renders
  // inside the content column so it matches the article width. Here we only
  // keep the v2 noindex directive.
  return (
    <>
      {pluginId === 'HyperIndexV2' && (
        <Head>
          <meta name="robots" content="noindex" />
        </Head>
      )}
      <Layout {...props} />
    </>
  );
}
