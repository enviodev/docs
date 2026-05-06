import React from 'react';
import { useLocation } from '@docusaurus/router';
import DropdownNavbarItem from '@theme/NavbarItem/DropdownNavbarItem';

const V2_PREFIX = '/docs/v2/HyperIndex';
const V3_PREFIX = '/docs/HyperIndex';

const ITEMS = [
  { key: 'v3', label: 'v3 (rc)', to: '/docs/HyperIndex/overview' },
  { key: 'v2', label: 'v2', to: '/docs/v2/HyperIndex/overview' },
];

export default function HyperIndexVersionDropdown(props) {
  const { pathname } = useLocation();

  const onV2 = pathname.startsWith(V2_PREFIX + '/') || pathname === V2_PREFIX;
  const onV3 =
    !onV2 &&
    (pathname.startsWith(V3_PREFIX + '/') || pathname === V3_PREFIX);

  if (!onV2 && !onV3) {
    return null;
  }

  const activeKey = onV2 ? 'v2' : 'v3';
  const activeLabel = ITEMS.find((i) => i.key === activeKey).label;

  return (
    <DropdownNavbarItem
      {...props}
      label={activeLabel}
      items={ITEMS.map(({ key, label, to }) => ({
        label,
        to,
        className: key === activeKey ? 'dropdown__link--active' : undefined,
      }))}
    />
  );
}
