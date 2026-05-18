import React from 'react';
import Layout from '@theme-original/DocItem/Layout';
import { useActivePlugin } from '@docusaurus/plugin-content-docs/client';
import useIsBrowser from '@docusaurus/useIsBrowser';
import Admonition from '@theme/Admonition';
import Link from '@docusaurus/Link';

export default function LayoutWrapper(props) {
  const activePlugin = useActivePlugin();
  const pluginId = activePlugin?.pluginId;
  // Defer the version banner to client-side render so it does not appear
  // in the SSR HTML stream above the article. This keeps the
  // content-start-position low for HTML→markdown agent crawlers. Users
  // still see the banner after hydration.
  const isBrowser = useIsBrowser();

  return (
    <>
      {isBrowser && pluginId === 'HyperIndexV2' && (
        <Admonition type="warning" title="You're viewing v2 documentation">
          <p>
            This is the <strong>v2</strong> HyperIndex documentation. We highly
            recommend migrating to <strong>v3</strong> — follow the{' '}
            <Link to="/docs/HyperIndex/migrate-to-v3">v3 migration guide</Link>.
          </p>
        </Admonition>
      )}
      {isBrowser && pluginId === 'HyperIndex' && (
        <Admonition type="info" title="You're viewing v3 documentation">
          <p>
            This is the <strong>v3</strong> HyperIndex documentation. Still on
            an older version? Open the{' '}
            <Link to="/docs/v2/HyperIndex/overview">v2 documentation</Link> and
            consider <Link to="/docs/HyperIndex/migrate-to-v3">migrating to v3</Link>.
          </p>
        </Admonition>
      )}
      <Layout {...props} />
    </>
  );
}
