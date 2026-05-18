import React from 'react';
import clsx from 'clsx';
import ErrorBoundary from '@docusaurus/ErrorBoundary';
import {
  PageMetadata,
  SkipToContentFallbackId,
  ThemeClassNames,
} from '@docusaurus/theme-common';
import {useKeyboardNavigation} from '@docusaurus/theme-common/internal';
import SkipToContent from '@theme/SkipToContent';
import AnnouncementBar from '@theme/AnnouncementBar';
import Navbar from '@theme/Navbar';
import Footer from '@theme/Footer';
import LayoutProvider from '@theme/Layout/Provider';
import ErrorPageContent from '@theme/ErrorPageContent';
import type {Props} from '@theme/Layout';
import styles from './styles.module.css';

export default function Layout(props: Props): JSX.Element {
  const {
    children,
    noFooter,
    wrapperClassName,
    // Not really layout-related, but kept for convenience/retro-compatibility
    title,
    description,
  } = props;

  useKeyboardNavigation();

  // Source order: SkipToContent → main content → Navbar → AnnouncementBar
  // → Footer. Pushing the main wrapper above the navbar in DOM order ensures
  // HTML→markdown agent crawlers reach documentation content before any nav
  // chrome. The navbar uses `position: fixed` (see src/css/custom.css) so it
  // still visually anchors to the top of the viewport.
  return (
    <LayoutProvider>
      <PageMetadata title={title} description={description} />

      <SkipToContent />

      <div
        id={SkipToContentFallbackId}
        className={clsx(
          ThemeClassNames.wrapper.main,
          styles.mainWrapper,
          wrapperClassName,
        )}>
        <ErrorBoundary fallback={(params) => <ErrorPageContent {...params} />}>
          {children}
        </ErrorBoundary>
      </div>

      <AnnouncementBar />

      <Navbar />

      {!noFooter && <Footer />}
    </LayoutProvider>
  );
}
