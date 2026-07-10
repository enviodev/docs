import React, {type ReactNode, useState, useCallback} from 'react';
import clsx from 'clsx';
import {prefersReducedMotion, ThemeClassNames} from '@docusaurus/theme-common';
import {useDocsSidebar} from '@docusaurus/theme-common/internal';
import {useLocation} from '@docusaurus/router';
import Link from '@docusaurus/Link';
import DocSidebar from '@theme/DocSidebar';
import SearchBar from '@theme/SearchBar';
import ExpandButton from '@theme/DocRoot/Layout/Sidebar/ExpandButton';
import type {Props} from '@theme/DocRoot/Layout/Sidebar';

import styles from './styles.module.css';

// Quick links surfaced at the top of the sidebar (Goldsky-style), moved out
// of the top navbar to keep the product tabs clean. External links get an
// arrow affordance.
const SIDEBAR_LINKS = [
  {label: 'Changelog', href: 'https://envio.dev/changelog', external: true},
  {label: 'Showcase', to: '/showcase'},
  {label: 'Blog', to: '/blog'},
  {label: "Shipper's Logs", to: '/videos'},
];

function SidebarHeader() {
  return (
    <div className={styles.sidebarHeader}>
      <div className={styles.sidebarSearch}>
        <SearchBar />
      </div>
      <nav className={styles.sidebarLinks} aria-label="Quick links">
        {SIDEBAR_LINKS.map((item) =>
          item.external ? (
            <a
              key={item.label}
              href={item.href}
              className={styles.sidebarLink}
              target="_blank"
              rel="noopener noreferrer">
              {item.label}
            </a>
          ) : (
            <Link key={item.label} to={item.to!} className={styles.sidebarLink}>
              {item.label}
            </Link>
          ),
        )}
      </nav>
    </div>
  );
}

// Reset sidebar state when sidebar changes
// Use React key to unmount/remount the children
// See https://github.com/facebook/docusaurus/issues/3414
function ResetOnSidebarChange({children}: {children: ReactNode}) {
  const sidebar = useDocsSidebar();
  return (
    <React.Fragment key={sidebar?.name ?? 'noSidebar'}>
      {children}
    </React.Fragment>
  );
}

export default function DocRootLayoutSidebar({
  sidebar,
  hiddenSidebarContainer,
  setHiddenSidebarContainer,
}: Props): JSX.Element {
  const {pathname} = useLocation();

  const [hiddenSidebar, setHiddenSidebar] = useState(false);
  const toggleSidebar = useCallback(() => {
    if (hiddenSidebar) {
      setHiddenSidebar(false);
    }
    // onTransitionEnd won't fire when sidebar animation is disabled
    // fixes https://github.com/facebook/docusaurus/issues/8918
    if (!hiddenSidebar && prefersReducedMotion()) {
      setHiddenSidebar(true);
    }
    setHiddenSidebarContainer((value) => !value);
  }, [setHiddenSidebarContainer, hiddenSidebar]);

  return (
    <aside
      className={clsx(
        ThemeClassNames.docs.docSidebarContainer,
        styles.docSidebarContainer,
        hiddenSidebarContainer && styles.docSidebarContainerHidden,
      )}
      onTransitionEnd={(e) => {
        // Guard against bubbled transitions from descendants and unrelated
        // properties; only the aside's own `width` transition should toggle
        // the hidden state.
        if (e.target !== e.currentTarget) {
          return;
        }
        if (e.propertyName !== 'width') {
          return;
        }

        if (hiddenSidebarContainer) {
          setHiddenSidebar(true);
        }
      }}>
      <ResetOnSidebarChange>
        <div
          className={clsx(
            styles.sidebarViewport,
            hiddenSidebar && styles.sidebarViewportHidden,
          )}>
          {!hiddenSidebar && <SidebarHeader />}
          <DocSidebar
            sidebar={sidebar}
            path={pathname}
            onCollapse={toggleSidebar}
            isHidden={hiddenSidebar}
          />
          {hiddenSidebar && <ExpandButton toggleSidebar={toggleSidebar} />}
        </div>
      </ResetOnSidebarChange>
    </aside>
  );
}
