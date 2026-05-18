import React, {useState} from 'react';
import {useDocsSidebar} from '@docusaurus/theme-common/internal';
import BackToTopButton from '@theme/BackToTopButton';
import DocRootLayoutSidebar from '@theme/DocRoot/Layout/Sidebar';
import DocRootLayoutMain from '@theme/DocRoot/Layout/Main';
import type {Props} from '@theme/DocRoot/Layout';

import styles from './styles.module.css';

export default function DocRootLayout({children}: Props): JSX.Element {
  const sidebar = useDocsSidebar();
  const [hiddenSidebarContainer, setHiddenSidebarContainer] = useState(false);
  return (
    <div className={styles.docsWrapper}>
      <BackToTopButton />
      {/* Source order: Main before Sidebar so HTML→markdown agent crawlers
          encounter article content before sidebar nav chrome. Visual order
          is preserved via `flex-direction: row-reverse` in styles. */}
      <div className={styles.docRoot}>
        <DocRootLayoutMain hiddenSidebarContainer={hiddenSidebarContainer}>
          {children}
        </DocRootLayoutMain>
        {sidebar && (
          <DocRootLayoutSidebar
            sidebar={sidebar.items}
            hiddenSidebarContainer={hiddenSidebarContainer}
            setHiddenSidebarContainer={setHiddenSidebarContainer}
          />
        )}
      </div>
    </div>
  );
}
