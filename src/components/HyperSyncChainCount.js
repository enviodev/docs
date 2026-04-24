import React from "react";
import useDocusaurusContext from "@docusaurus/useDocusaurusContext";

function useCount() {
  const { siteConfig } = useDocusaurusContext();
  return siteConfig.customFields?.hyperSyncChainCount;
}

export default function HyperSyncChainCount() {
  const count = useCount();
  return <>{count ? `${count}+` : "many"}</>;
}

export function HyperSyncChainCountPlain() {
  const count = useCount();
  return <>{count ? `${count}` : "many"}</>;
}
