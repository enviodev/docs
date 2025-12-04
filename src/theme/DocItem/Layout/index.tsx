import React from 'react';
import Layout from '@theme-original/DocItem/Layout';
import BottomChatInput from '../../../components/BottomChatInput';
import type {Props} from '@theme/DocItem/Layout';

export default function DocItemLayoutWrapper(props: Props): JSX.Element {
  return (
    <>
      <Layout {...props} />
      <BottomChatInput />
    </>
  );
}
