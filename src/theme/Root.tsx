import React from 'react';
import BottomChatInput from '../components/BottomChatInput';

export default function Root({ children }: { children: React.ReactNode }): JSX.Element {
  return (
    <>
      {children}
      <BottomChatInput />
    </>
  );
}
