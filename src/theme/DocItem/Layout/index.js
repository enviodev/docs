import React, {useEffect} from 'react';
import Layout from '@theme-original/DocItem/Layout';
import {useActivePlugin} from '@docusaurus/plugin-content-docs/client';
import {useLocation} from '@docusaurus/router';
import useIsBrowser from '@docusaurus/useIsBrowser';
import Head from '@docusaurus/Head';

export default function LayoutWrapper(props) {
  const activePlugin = useActivePlugin();
  const pluginId = activePlugin?.pluginId;
  const {pathname} = useLocation();
  const isBrowser = useIsBrowser();

  // The version banner (src/theme/DocVersionBanner) renders inside the content
  // column so it matches the article width. That pushes the page title down,
  // but the right-hand TOC is a sibling column and doesn't move — so on banner
  // pages the TOC would sit above the title. Measure the banner's occupied
  // height and expose it as --envio-toc-banner-offset; the TOC's margin-top
  // adds it in (custom.css) so the TOC lines up with the h1 on every page.
  useEffect(() => {
    const root = document.documentElement;
    const update = () => {
      const banner = document.querySelector('.envio-version-banner');
      if (!banner) {
        root.style.setProperty('--envio-toc-banner-offset', '0px');
        return;
      }
      // The amount the content below the banner is pushed down is the gap from
      // the banner's top to the next element (the breadcrumb), which captures
      // the banner's height plus its collapsed margins.
      const bannerTop = banner.getBoundingClientRect().top;
      const next = banner.nextElementSibling;
      const offset = next
        ? next.getBoundingClientRect().top - bannerTop
        : banner.getBoundingClientRect().height;
      root.style.setProperty(
        '--envio-toc-banner-offset',
        `${Math.round(Math.max(0, offset))}px`,
      );
    };
    update();
    // The banner is client-rendered and reflows on resize; keep it in sync.
    const banner = document.querySelector('.envio-version-banner');
    const ro =
      banner && typeof ResizeObserver !== 'undefined'
        ? new ResizeObserver(update)
        : null;
    if (ro && banner) ro.observe(banner);
    window.addEventListener('resize', update);
    return () => {
      if (ro) ro.disconnect();
      window.removeEventListener('resize', update);
      root.style.setProperty('--envio-toc-banner-offset', '0px');
    };
  }, [pathname, isBrowser]);

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
