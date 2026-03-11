import React from "react";
import Link from "@docusaurus/Link";
import { useThemeConfig } from "@docusaurus/theme-common";

function Footer() {
  const { footer } = useThemeConfig();
  if (!footer) return null;

  const links = footer.links.flatMap((group) =>
    group.items.map((item) => ({
      label: item.label,
      href: item.href || item.to,
      isExternal: !!item.href,
    }))
  );

  return (
    <footer
      style={{
        borderTop: "1px solid var(--ifm-color-emphasis-300)",
        background: "var(--ifm-background-color)",
      }}
    >
      <div
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          maxWidth: "var(--ifm-container-width)",
          margin: "0 auto",
          padding: "0 1rem",
          height: "var(--ifm-navbar-height)",
          fontSize: "0.875rem",
        }}
      >
        <span style={{ color: "var(--ifm-color-emphasis-600)" }}>
          {footer.copyright}
        </span>

        <nav style={{ display: "flex", gap: "1.5rem", alignItems: "center" }}>
          {links.map((link, i) => (
            <Link
              key={i}
              to={link.href}
              style={{
                color: "var(--ifm-color-emphasis-600)",
                fontSize: "0.875rem",
                textDecoration: "none",
              }}
              {...(link.isExternal
                ? { target: "_blank", rel: "noopener noreferrer" }
                : {})}
            >
              {link.label}
            </Link>
          ))}
        </nav>
      </div>
    </footer>
  );
}

export default React.memo(Footer);
