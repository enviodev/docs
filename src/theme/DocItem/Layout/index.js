import React from 'react';
import Layout from '@theme-original/DocItem/Layout';
import { useActivePlugin } from '@docusaurus/plugin-content-docs/client';
import Admonition from '@theme/Admonition';
import Link from '@docusaurus/Link';

export default function LayoutWrapper(props) {
  const activePlugin = useActivePlugin();
  const pluginId = activePlugin?.pluginId;

  return (
    <>
      {pluginId === 'HyperIndexV2' && (
        <Admonition type="warning" title="You're viewing v2 documentation">
          <p>
            This is the <strong>v2</strong> HyperIndex documentation. We highly
            recommend migrating to <strong>v3</strong> — follow the{' '}
            <Link to="/docs/HyperIndex/migrate-to-v3">v3 migration guide</Link>.
          </p>
        </Admonition>
      )}
      {pluginId === 'HyperIndex' && (
        <Admonition type="info" title="You're viewing v3 documentation">
          <p>
            This is the <strong>v3</strong> HyperIndex documentation. Still on
            an older version? Open the{' '}
            <Link to="/docs/HyperIndex/v2/overview">v2 documentation</Link> and
            consider <Link to="/docs/HyperIndex/migrate-to-v3">migrating to v3</Link>.
          </p>
        </Admonition>
      )}
      <Layout {...props} />
    </>
  );
}
