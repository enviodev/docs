import React from 'react';
import Content from '@theme-original/DocItem/Content';
import CopyPageButton from '@site/src/components/CopyPageButton';

// Renders the "Copy page / AI actions" split button at the top-right of the
// article (floated), then the normal MDX content.
export default function ContentWrapper(props) {
  return (
    <>
      <CopyPageButton />
      <Content {...props} />
    </>
  );
}
