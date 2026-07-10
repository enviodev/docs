import React from 'react';
import Layout from '@theme-original/DocItem/Layout';
import {useActivePlugin} from '@docusaurus/plugin-content-docs/client';
import {useLocation} from '@docusaurus/router';
import useIsBrowser from '@docusaurus/useIsBrowser';
import Head from '@docusaurus/Head';
import Admonition from '@theme/Admonition';
import Link from '@docusaurus/Link';

// Envio Cloud pages live in the HyperIndex plugin but are their own section,
// so the HyperIndex version banner should not appear on them.
const ENVIO_CLOUD_RE =
  /^\/docs\/HyperIndex\/(hosted-service|self-hosting|organisation-setup|envio-cloud-cli)/;

// The version banner is rendered here, ABOVE DocItem/Layout's column row,
// rather than inside the content column. Inside the column it pushed the h1
// down while the sibling TOC column stayed put, so the two fell out of line on
// banner pages. Rendered above the row, both columns start at the same y and
// the TOC lines up with the title using the same static offset as every other
// page — no measurement needed.
//
// Kept client-only (useIsBrowser) so it stays out of the SSR HTML stream,
// keeping the content-start-position low for agent crawlers. The in-column
// @theme/DocVersionBanner is neutralised to null.
function VersionBanner() {
  const pluginId = useActivePlugin()?.pluginId;
  const {pathname} = useLocation();
  const isBrowser = useIsBrowser();

  if (!isBrowser) {
    return null;
  }

  if (pluginId === 'HyperIndexV2') {
    return (
      <Admonition type="warning" title="You're viewing v2 documentation">
        <p>
          This is the <strong>v2</strong> HyperIndex documentation. We highly
          recommend migrating to <strong>v3</strong> — follow the{' '}
          <Link to="/docs/HyperIndex/migrate-to-v3">v3 migration guide</Link>.
        </p>
      </Admonition>
    );
  }

  if (pluginId === 'HyperIndex' && !ENVIO_CLOUD_RE.test(pathname)) {
    return (
      <Admonition type="info" title="You're viewing v3 documentation">
        <p>
          This is the <strong>v3</strong> HyperIndex documentation. Still on an
          older version? Open the{' '}
          <Link to="/docs/v2/HyperIndex/overview">v2 documentation</Link> and
          consider{' '}
          <Link to="/docs/HyperIndex/migrate-to-v3">migrating to v3</Link>.
        </p>
      </Admonition>
    );
  }

  return null;
}

export default function LayoutWrapper(props) {
  const pluginId = useActivePlugin()?.pluginId;

  return (
    <>
      {pluginId === 'HyperIndexV2' && (
        <Head>
          <meta name="robots" content="noindex" />
        </Head>
      )}
      <VersionBanner />
      <Layout {...props} />
    </>
  );
}
