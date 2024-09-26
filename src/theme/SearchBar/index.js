import React from 'react';
import SearchBar from '@theme-original/SearchBar';
import AskCookbook from '@cookbookdev/docsbot/react'
import BrowserOnly from '@docusaurus/BrowserOnly';

/** It's a public API key, so it's safe to expose it here */
const COOKBOOK_PUBLIC_API_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiI2NmY0NjNmNmJkODc1Y2E3NmUwMjAzMTciLCJpYXQiOjE3MjcyOTI0MDYsImV4cCI6MjA0Mjg2ODQwNn0.ruDwarOVwJ68IihIdMcqeKM7C0E_JaV-f0JIgqNwsdo";
export default function SearchBarWrapper(props) {
  return (
    <>
      <SearchBar {...props} />
      <BrowserOnly>{() => <AskCookbook apiKey={COOKBOOK_PUBLIC_API_KEY} /> }</BrowserOnly>
    </>
  );
}
