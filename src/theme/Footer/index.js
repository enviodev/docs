import React from "react";
import Link from "@docusaurus/Link";
import { useThemeConfig } from "@docusaurus/theme-common";
import styles from "./styles.module.css";

// This override used to flatten every footer group into one row inside a
// fixed-height bar (`height: var(--ifm-navbar-height)`), which worked while the
// footer held four links. It now carries twenty across four groups, and a
// single row overflowed into an unreadable strip with the group headings
// dropped entirely. Rendering the groups as columns is also the point of the
// footer: it is the only surface that gives a page a sitewide link.
function Footer() {
  const { footer } = useThemeConfig();
  if (!footer) return null;

  const groups = (footer.links ?? []).filter(
    (group) => (group.items ?? []).length > 0
  );

  return (
    <footer className={styles.footer}>
      <div className={styles.inner}>
        <div className={styles.columns}>
          {groups.map((group) => (
            <div key={group.title} className={styles.column}>
              <div className={styles.heading}>{group.title}</div>
              {group.items.map((item) => {
                const href = item.href || item.to;
                const isExternal = !!item.href;
                return (
                  <Link
                    key={href ?? item.label}
                    to={href}
                    className={styles.link}
                    {...(isExternal
                      ? { target: "_blank", rel: "noopener noreferrer" }
                      : {})}
                  >
                    {item.label}
                  </Link>
                );
              })}
            </div>
          ))}
        </div>
        {footer.copyright && (
          <div className={styles.bottom}>{footer.copyright}</div>
        )}
      </div>
    </footer>
  );
}

export default React.memo(Footer);
