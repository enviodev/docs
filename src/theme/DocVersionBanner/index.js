import React from 'react';
import {useActivePlugin} from '@docusaurus/plugin-content-docs/client';
import {useLocation} from '@docusaurus/router';
import useIsBrowser from '@docusaurus/useIsBrowser';
import Admonition from '@theme/Admonition';
import Link from '@docusaurus/Link';

// Envio Cloud pages live in the HyperIndex plugin but are their own section,
// so the HyperIndex version banner should not appear on them.
const ENVIO_CLOUD_RE =
  /^\/docs\/HyperIndex\/(hosted-service|self-hosting|organisation-setup|envio-cloud-cli)/;

// Rendered by DocItem/Layout inside the content column (above the
// breadcrumbs), so it's constrained to the article width like any other
// admonition — not spanning the full page across the TOC.
//
// Deferred to client-side render (useIsBrowser) so it stays out of the SSR
// HTML stream, keeping the content-start-position low for agent crawlers.
export default function DocVersionBanner() {
  const activePlugin = useActivePlugin();
  const pluginId = activePlugin?.pluginId;
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
