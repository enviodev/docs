import React from "react";
import { useLocation } from "@docusaurus/router";
import DropdownNavbarItem from "@theme/NavbarItem/DropdownNavbarItem";

export default function VersionDropdownNavbarItem(props) {
  const { pathname } = useLocation();
  const isV2 = pathname.startsWith("/docs/v2/");
  const label = isV2 ? "v2" : "v3";
  return <DropdownNavbarItem {...props} label={label} />;
}
